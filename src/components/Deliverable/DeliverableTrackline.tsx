import { ApolloClient, useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_ANNUAL_YEARS, GET_FINANCIAL_YEARS } from "../../graphql";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
} from "../../graphql/Deliverable/target";
import {
	CREATE_DELIVERABLE_TRACKLINE,
	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
	GET_DELIVERABLE_TRACKLINE_COUNT,
	UPDATE_DELIVERABLE_TRACKLINE,
} from "../../graphql/Deliverable/trackline";
import {
	DeliverableTargetLineProps,
	IDeliverableTargetLine,
} from "../../models/deliverable/deliverableTrackline";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { getFetchPolicy, getTodaysDate, uploadPercentageCalculator } from "../../utils";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FORM_ACTIONS } from "../Forms/constant";
import { FullScreenLoader } from "../Loader/Loader";
import DeliverableStepper from "../Stepper/Stepper";
import { DELIVERABLE_ACTIONS } from "./constants";
import DeliverableTracklineDonorYearTags from "./DeliverableTracklineDonor";
import { deliverableTragetLineForm } from "./inputField.json";
import {
	IDeliverableTracklineByTargetResponse,
	IGET_DELIVERABLE_TRACKLINE_BY_TARGET,
} from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import AttachFileForm from "../Forms/AttachFiles";
import { AttachFile } from "../../models/AttachFile";
import useMultipleFileUpload from "../../hooks/multipleFileUpload";
import { CircularPercentage, FormDetails } from "../commons";
import { GET_ALL_DELIVERABLES_SPEND_AMOUNT, GET_PROJ_DONORS } from "../../graphql/project";
import DeliverableTarget from "./DeliverableTarget";
import { IGetProjectDonor, IProjectDonor } from "../../models/project/project";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { IGET_DONOR } from "../../models/donor/query";
import { CREATE_PROJECT_DONOR, UPDATE_PROJECT_DONOR } from "../../graphql/donor/mutation";
import { updateProjectDonorCache } from "../Project/Project";
import Donor from "../Donor";
import { DELIVERABLE_TYPE, DIALOG_TYPE } from "../../models/constants";
import DeleteModal from "../DeleteModal";
import { useDocumentTableDataRefetch } from "../../hooks/document";
import { GET_YEARTAGS } from "../../graphql/yearTags/query";
import { YearTagPayload } from "../../models/yearTags";
import { GET_DELIVERABLE_SUB_TARGETS } from "../../graphql/Deliverable/subTarget";
import SubTarget from "../Forms/SubTargetForm";

function getInitialValues(props: DeliverableTargetLineProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		deliverable_target_project: undefined,
		deliverable_sub_target: props?.deliverableSubTargetId,
		timeperiod_start: "",
		timeperiod_end: "",
		annual_year: "",
		value: 0,
		financial_year: "",
		financial_year_org: "",
		financial_year_donor: "",
		reporting_date: getTodaysDate(),
		note: "",
		donors: [],
	};
}

const FormDetailsCalculate = React.memo(
	({ currentTargetId }: { currentTargetId: string | number }) => {
		const { data: deliverableTargetResponse } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
			variables: {
				filter: { id: currentTargetId },
			},
			fetchPolicy: getFetchPolicy(),
		});
		// const { data: achivedValue } = useQuery(GET_ACHIEVED_VALLUE_BY_TARGET, {
		// 	variables: { filter: { deliverableTargetProject: currentTargetId } },
		// });

		// let deliverableTargetResponse: any;
		const intl = useIntl();
		let deliverableCategoryLabel = intl.formatMessage({
			id: "deliverableCategoryLabelFormDetail",
			defaultMessage: "Category",
			description:
				"This text will be show on deliverable trackline form for deliverable category",
		});
		let deliverableTotalTargetLabel = intl.formatMessage({
			id: "deliverableTotalTargetLabelFormDetail",
			defaultMessage: "Target",
			description:
				"This text will be show on deliverable trackline form for deliverable category",
		});
		let deliverableAchievedTargetLabel = intl.formatMessage({
			id: "deliverableAchievedTargetLabelFormDetail",
			defaultMessage: "Achieved",
			description:
				"This text will be show on deliverable trackline form for deliverable category",
		});

		let fetchedDeliverableTarget = deliverableTargetResponse?.deliverableTargetList[0];
		let formDetailsArray = fetchedDeliverableTarget
			? [
					{
						label: deliverableCategoryLabel,
						value: fetchedDeliverableTarget.deliverable_category_org?.name,
					},
					{
						label: deliverableTotalTargetLabel,
						value: `${fetchedDeliverableTarget.target_value} ${
							fetchedDeliverableTarget?.deliverable_unit_org?.name || ""
						}`,
					},
					// {
					// 	label: deliverableAchievedTargetLabel,
					// 	value: `${achivedValue?.deliverableTrackingTotalValue} ${
					// 		fetchedDeliverableTarget?.deliverable_unit_org?.name || ""
					// 	}`,
					// },
			  ]
			: [];
		return (
			<FormDetails
				formDetails={formDetailsArray}
				title={fetchedDeliverableTarget?.name || ""}
			/>
		);
	}
);
export const getProjectDonorsWithDonorsId = (
	selectedDonors: any,
	projectDonors: IProjectDonor[] | undefined
) => {
	let projectDonorsWithSameIdAsSelectedDonors: any = [];

	projectDonors?.forEach((projectDonor: IProjectDonor) => {
		let projectDonoContainsSelectedDonor = false;
		selectedDonors?.forEach((selectedDonor: any) => {
			if (projectDonor.donor.id === selectedDonor.id) {
				projectDonoContainsSelectedDonor = true;
				return false;
			}
		});
		if (projectDonoContainsSelectedDonor)
			projectDonorsWithSameIdAsSelectedDonors.push({
				...projectDonor,
				name: projectDonor.donor.name,
			});
	});
	return projectDonorsWithSameIdAsSelectedDonors;
};

const fetchDeliverableTracklineByTarget = async ({
	apolloClient,
	currentTargetId = "",
}: {
	apolloClient: ApolloClient<object>;
	currentTargetId: string | number | undefined;
}) => {
	try {
		await apolloClient.query({
			query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
			variables: {
				filter: {
					deliverable_target_project: currentTargetId,
				},
			},
		});
	} catch (err) {
		console.error(err);
	}
};

function DeliverableTrackLine(props: DeliverableTargetLineProps) {
	const apolloClient = useApolloClient();
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IDeliverableTargetLine = getInitialValues(props);

	const intl = useIntl();

	useQuery(GET_PROJ_DONORS, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});

	useQuery(GET_ORG_DONOR, {
		variables: { filter: { organization: DashBoardData?.organization?.id } },
	});

	let cachedProjectDonors: IGetProjectDonor | null = null;
	try {
		cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>(
			{
				query: GET_PROJ_DONORS,
				variables: { filter: { project: DashBoardData?.project?.id } },
			},
			true
		);
	} catch (error) {
		console.error(error);
	}

	let cachedOrganizationDonors: IGET_DONOR | null = null;
	try {
		cachedOrganizationDonors = apolloClient.readQuery<IGET_DONOR>(
			{
				query: GET_ORG_DONOR,
				variables: { filter: { organization: DashBoardData?.organization?.id } },
			},
			true
		);
	} catch (error) {
		console.error(error);
	}

	const [donors, setDonors] = React.useState<
		{
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}[]
	>();

	// const [donorForm, setDonorForm] = React.useState<React.ReactNode | undefined>();
	const [donorFormData, setDonorFormData] = React.useState<any>();
	const [openAttachFiles, setOpenAttachFiles] = React.useState<boolean>();
	const [filesArray, setFilesArray] = React.useState<AttachFile[]>(
		props.type === DELIVERABLE_ACTIONS.UPDATE
			? props.data.attachments
				? [...props.data.attachments]
				: []
			: []
	);

	if (filesArray.length) deliverableTragetLineForm[9].label = "View Files";
	else deliverableTragetLineForm[9].label = "Attach Files";

	if (filesArray.length)
		deliverableTragetLineForm[9].textNextToButton = `${filesArray.length} files attached`;
	else deliverableTragetLineForm[9].textNextToButton = ``;

	const [currentTargetId, setCurrentTargetId] = React.useState<string | number | undefined>(
		props.deliverableTarget ? props.deliverableTarget : ""
	);

	deliverableTragetLineForm[0].getInputValue = setCurrentTargetId;

	const formAction = props.type;
	const formIsOpen = props.open;

	if (formAction === DELIVERABLE_ACTIONS.UPDATE) {
		deliverableTragetLineForm[0].hidden = true;
		deliverableTragetLineForm[1].size = 12;
		deliverableTragetLineForm[2].size = 12;
	} else {
		deliverableTragetLineForm[0].hidden = false;
		deliverableTragetLineForm[1].size = 6;
		deliverableTragetLineForm[2].size = 6;
	}

	const [isQualitativeParentTarrget, setIsQualitativeParentTarget] = useState(
		props.qualitativeParent || false
	);

	const [parentTargetValueOptions, setParentTargetValueOptions] = useState<any>(
		props.targetValueOptions || []
	);

	deliverableTragetLineForm[2].optionsArray = parentTargetValueOptions;
	useEffect(() => {
		if (isQualitativeParentTarrget) {
			deliverableTragetLineForm[1].hidden = true;
			deliverableTragetLineForm[2].hidden = false;
		} else {
			deliverableTragetLineForm[1].hidden = false;
			deliverableTragetLineForm[2].hidden = true;
		}
	}, [isQualitativeParentTarrget]);

	deliverableTragetLineForm[0].getInputValue = (targetId: string) => {
		let subTargetOptions = deliverableTargets.deliverableSubTargets;
		let subTarget = subTargetOptions.find((elem: any) => elem.id === targetId);
		console.log("target", subTarget);
		setIsQualitativeParentTarget(
			subTarget?.deliverable_target_project?.is_qualitative || false
		);
		setParentTargetValueOptions(
			subTarget?.deliverable_target_project?.value_qualitative_option?.options || []
		);
	};

	const onCancel = () => {
		props.handleClose();
	};
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	let formTitle =
		props.formType === "deliverable"
			? intl.formatMessage({
					id: "deliverableAchievementFormTitle",
					defaultMessage: "Deliverable Achievement",
					description: `This text will be show on deliverable Achievement form for title`,
			  })
			: props.formType === "impact"
			? intl.formatMessage({
					id: "impactAchievementFormTitle",
					defaultMessage: "Impact Achievement",
					description: `This text will be show on Impact Achievement form for title`,
			  })
			: props.formType === "outcome"
			? intl.formatMessage({
					id: "outcomeAchievementFormTitle",
					defaultMessage: "Outcome Achievement",
					description: `This text will be show on Outcome Achievement form for title`,
			  })
			: props.formType === "output"
			? intl.formatMessage({
					id: "outputAchievementFormTitle",
					defaultMessage: "Output Achievement",
					description: `This text will be show on output Achievement form for title`,
			  })
			: props.formType === "activity"
			? intl.formatMessage({
					id: "activityAchievementFormTitle",
					defaultMessage: "Activity Achievement",
					description: `This text will be show on Activity Achievement form for title`,
			  })
			: "";
	let formSubtitle = intl.formatMessage({
		id: "deliverableAchievementFormSubtitle",
		defaultMessage: "Physical addresses of your organisation like headquarter branch etc",
		description: `This text will be show on deliverable Achievement form for subtitle`,
	});

	const { data: deliverableTargets } = useQuery(GET_DELIVERABLE_SUB_TARGETS, {
		variables: {
			filter: {
				project: DashBoardData?.project?.id,
				deliverable_target_project: {
					type: props.formType,
				},
			},
		},
	});
	let {
		multiplefileMorph,
		loading: uploadMorphLoading,
		success,
		setSuccess,
	} = useMultipleFileUpload(filesArray, setFilesArray);

	const [openDeliverableTargetDialog, setOpenDeliverableTargetDialog] = React.useState<boolean>();
	deliverableTragetLineForm[0].addNewClick = () => setOpenDeliverableTargetDialog(true);

	/* Open Attach File Form*/
	deliverableTragetLineForm[10].onClick = () => setOpenAttachFiles(true);

	const [createProjectDonor, { loading: creatingProjectDonorsLoading }] = useMutation(
		CREATE_PROJECT_DONOR,
		{
			onCompleted: (data) => {
				updateProjectDonorCache({ apolloClient, projecttDonorCreated: data });
			},
		}
	);
	const [updateProjectDonor, { loading: updatingProjectDonorsLoading }] = useMutation(
		UPDATE_PROJECT_DONOR
	);

	const [lists, setList] = useState<{
		annualYear: any;
		financialYear: any;
	}>({
		annualYear: [],
		financialYear: [],
	});

	const { data: yearTags } = useQuery(GET_YEARTAGS, {
		onError: (err) => {
			console.log("err", err);
		},
	});

	useEffect(() => {
		let yearTagsLists: {
			annualYear: any;
			financialYear: any;
		} = {
			annualYear: [],
			financialYear: [],
		};
		yearTags?.yearTags?.forEach((elem: YearTagPayload) => {
			if (elem.type === "annual") {
				yearTagsLists.annualYear.push(elem);
			} else if (elem.type === "financial") {
				yearTagsLists.financialYear.push(elem);
			}
		});
		setList(yearTagsLists);
	}, [yearTags]);
	const getProjectDonorIdForGivenDonorId = (
		projectDonors: IGetProjectDonor["projectDonors"] | undefined,
		donorId: any
	) => projectDonors?.find((projectDonor) => projectDonor?.donor?.id == donorId)?.id;

	const createProjectDonorHelper = (value: any) => {
		const projectDonorIdForGivenDonor = getProjectDonorIdForGivenDonorId(
			cachedProjectDonors?.projectDonors,
			value.id
		);
		if (projectDonorIdForGivenDonor) {
			updateProjectDonor({
				variables: {
					id: projectDonorIdForGivenDonor,
					input: {
						project: DashBoardData?.project?.id,
						donor: value.id,
						deleted: false,
					},
				},
			});
		} else {
			createProjectDonor({
				variables: {
					input: {
						project: DashBoardData?.project?.id,
						donor: value.id,
					},
				},
			});
		}
	};

	// deliverableTragetLineForm[5].customMenuOnClick = createProjectDonorHelper;

	React.useEffect(() => {
		if (success) {
			if (props.type === DELIVERABLE_ACTIONS.CREATE) {
				fetchDeliverableTracklineByTarget({ apolloClient, currentTargetId });
			} else if (props.type === DELIVERABLE_ACTIONS.UPDATE && props.reftechOnSuccess) {
				props.reftechOnSuccess();
			}
			setSuccess(false);
		}
	}, [success, props, setSuccess, currentTargetId]);
	const { refetchDocuments } = useDocumentTableDataRefetch({ projectDocumentRefetch: false });

	const [createDeliverableTrackline, { loading }] = useMutation(CREATE_DELIVERABLE_TRACKLINE, {
		onCompleted(data) {
			// setDonorForm(
			// 	<DeliverableTracklineDonorYearTags
			// 		donors={donors}
			// 		TracklineId={data.createDeliverableTrackingLineitemDetail.id}
			// 		TracklineFyId={data.createDeliverableTrackingLineitemDetail.financial_year?.id}
			// 		onCancel={onCancel}
			// 		type={FORM_ACTIONS.CREATE}
			// 	/>
			// );
			multiplefileMorph({
				related_id: data.createDeliverableTrackingLineitemDetail.id,
				related_type: "deliverable_tracking_lineitem",
				field: "attachments",
			}).then(() => {
				refetchDocuments();
			});
			notificationDispatch(
				setSuccessNotification("Deliverable Trackline created successfully!")
			);
		},
		onError(err) {
			notificationDispatch(setErrorNotification(err?.message));
		},
	});
	const [
		updateDeliverableTrackLine,
		{ loading: updateDeliverableTrackLineLoading },
	] = useMutation(UPDATE_DELIVERABLE_TRACKLINE, {
		onCompleted(data) {
			// setDonorForm(
			// 	<DeliverableTracklineDonorYearTags
			// 		donors={donors}
			// 		TracklineId={data.updateDeliverableTrackingLineitemDetail.id}
			// 		TracklineFyId={data.updateDeliverableTrackingLineitemDetail.financial_year?.id}
			// 		data={Object.keys(donorFormData).length ? donorFormData : {}} // stores dynamic key values with use of donorId
			// 		onCancel={onCancel}
			// 		type={
			// 			Object.keys(donorFormData).length
			// 				? FORM_ACTIONS.UPDATE
			// 				: FORM_ACTIONS.CREATE
			// 		}
			// 		alreadyMappedDonorsIds={
			// 			props.type === DELIVERABLE_ACTIONS.UPDATE
			// 				? props.alreadyMappedDonorsIds
			// 				: []
			// 		}
			// 	/>
			// );
			notificationDispatch(
				setSuccessNotification("Deliverable Trackline Updated successfully!")
			);
		},
		onError(err) {
			notificationDispatch(setErrorNotification(err?.message));
		},
	});
	const [deleteDeliverableTrackLine, { loading: deletingDeliverableTrackline }] = useMutation(
		UPDATE_DELIVERABLE_TRACKLINE
	);

	// updating annaul year field with fetched annual year list

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (deliverableTargets) {
			deliverableTragetLineForm[0].optionsArray = deliverableTargets.deliverableSubTargets;
		}
	}, [deliverableTargets]);

	// deliverableTragetLineForm[5].optionsArray = useMemo(() => {
	// 	let donorsArray: any = [];
	// 	if (cachedProjectDonors)
	// 		cachedProjectDonors?.projectDonors
	// 			.filter((projectDonor) => !projectDonor?.deleted)
	// 			.forEach((elem: IProjectDonor) => {
	// 				if (
	// 					props.type === DELIVERABLE_ACTIONS.UPDATE &&
	// 					props.alreadyMappedDonorsIds?.includes(elem.donor.id)
	// 				)
	// 					donorsArray.push({
	// 						...elem,
	// 						id: elem.donor.id,
	// 						name: elem.donor.name,
	// 						disabled: true,
	// 					});
	// 				else
	// 					donorsArray.push({
	// 						...elem,
	// 						id: elem.donor.id,
	// 						name: elem.donor.name,
	// 					});
	// 			});
	// 	return donorsArray;
	// }, [cachedProjectDonors, props]);

	// deliverableTragetLineForm[5].secondOptionsArray = useMemo(() => {
	// 	let organizationMinusProjectDonors: any = [];
	// 	if (cachedProjectDonors && cachedOrganizationDonors)
	// 		cachedOrganizationDonors.orgDonors.forEach((orgDonor: { id: string; name: string }) => {
	// 			let projectDonorNotContainsOrgDonor = true;
	// 			cachedProjectDonors?.projectDonors.forEach((projectDonor: IProjectDonor) => {
	// 				if (orgDonor.id === projectDonor.donor.id && !projectDonor.deleted) {
	// 					projectDonorNotContainsOrgDonor = false;
	// 					return false;
	// 				}
	// 			});
	// 			if (projectDonorNotContainsOrgDonor)
	// 				organizationMinusProjectDonors.push({
	// 					...orgDonor,
	// 				});
	// 		});
	// 	return organizationMinusProjectDonors;
	// }, [cachedProjectDonors, cachedOrganizationDonors]);

	// updating financial year field with fetched financial year list
	useEffect(() => {
		if (lists?.financialYear) {
			deliverableTragetLineForm[7].optionsArray = lists.financialYear; //fyData.financialYearList;
		}
		if (lists?.financialYear) {
			deliverableTragetLineForm[8].optionsArray = lists.financialYear; //fyData.financialYearList;
		}
		if (lists?.annualYear) {
			deliverableTragetLineForm[6].optionsArray = lists.annualYear; //annualYears.annualYears;
		}
	}, [lists]);

	const getDeliverableTargetBySubTarget = async (
		apolloClient: any,
		deliverable_sub_target: string
	) => {
		let subtarget;
		try {
			subtarget = await apolloClient.query({
				query: GET_DELIVERABLE_SUB_TARGETS,
				variables: {
					filter: {
						id: deliverable_sub_target,
					},
				},
				fetchPolicy: "network-only",
			});
		} catch (error) {
			console.error(error);
		}
		return (
			subtarget?.data?.deliverableSubTargets?.[0]?.deliverable_target_project?.id || undefined
		);
	};

	const onCreate = async (value: IDeliverableTargetLine) => {
		let currentDeliverableTarget = await getDeliverableTargetBySubTarget(
			apolloClient,
			value.deliverable_sub_target || ""
		);
		value.reporting_date = new Date(value.reporting_date);
		// setSelectedDeliverableTarget(value.deliverable_target_project);
		// setCreateDeliverableTracklineFyId(value.financial_year);

		let input = { ...value };
		delete (input as any).donors;
		if (!input.annual_year) delete (input as any).annual_year;
		if (!input.financial_year) delete (input as any).financial_year;

		let donorsForTracklineDonorForm = getProjectDonorsWithDonorsId(
			value.donors?.filter((item) => !!item),
			cachedProjectDonors?.projectDonors
		);
		setDonors(donorsForTracklineDonorForm);

		createDeliverableTrackline({
			variables: { input },
			update: async (
				store,
				{ data: { createDeliverableTrackingLineitemDetail: lineItemCreated } }
			) => {
				try {
					const count = await store.readQuery<{
						deliverableTrackingLineitemCount: number;
					}>({
						query: GET_DELIVERABLE_TRACKLINE_COUNT,
						variables: {
							filter: {
								deliverable_sub_target: value.deliverable_sub_target,
							},
						},
					});
					store.writeQuery<{ deliverableTrackingLineitemCount: number }>({
						query: GET_DELIVERABLE_TRACKLINE_COUNT,
						variables: {
							filter: {
								deliverable_sub_target: value.deliverable_sub_target,
							},
						},
						data: {
							deliverableTrackingLineitemCount:
								count!.deliverableTrackingLineitemCount + 1,
						},
					});
					let limit = 0;
					if (count) {
						limit = count.deliverableTrackingLineitemCount;
					}
					const data = await store.readQuery<IGET_DELIVERABLE_TRACKLINE_BY_TARGET>({
						query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
						variables: {
							filter: {
								deliverable_sub_target: value.deliverable_sub_target,
							},
							limit: limit > 10 ? 10 : limit,
							start: 0,
							sort: "created_at:DESC",
						},
					});
					let deliverableTrackingLineitemList: IDeliverableTracklineByTargetResponse[] = data?.deliverableTrackingLineitemList
						? data?.deliverableTrackingLineitemList
						: [];
					store.writeQuery<IGET_DELIVERABLE_TRACKLINE_BY_TARGET>({
						query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
						variables: {
							filter: {
								deliverable_target_project: value.deliverable_sub_target,
							},
							limit: limit > 10 ? 10 : limit,
							start: 0,
							sort: "created_at:DESC",
						},
						data: {
							deliverableTrackingLineitemList: [
								lineItemCreated,
								...deliverableTrackingLineitemList,
							],
						},
					});
				} catch (err) {
					console.error(err);
				} finally {
					props.handleClose();
				}
			},
			refetchQueries: [
				// {
				// 	query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
				// 	variables: {
				// 		filter: {
				// 			deliverable_sub_target: value.deliverable_sub_target,
				// 		},
				// 	},
				// },
				// {
				// 	query: GET_ACHIEVED_VALLUE_BY_TARGET,
				// 	variables: {
				// 		filter: { deliverableTargetProject: value.deliverable_target_project },
				// 	},
				// },
				{
					query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
					variables: {
						filter: { project: DashBoardData?.project?.id },
					},
				},
				{
					query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
					variables: {
						filter: {
							deliverable_sub_target: {
								deliverable_target_project: currentDeliverableTarget,
								project: DashBoardData?.project?.id,
							},
						},
						sort: "created_at:DESC",
					},
				},
				{
					query: GET_DELIVERABLE_TRACKLINE_COUNT,
					variables: {
						filter: {
							deliverable_sub_target: {
								deliverable_target_project: currentDeliverableTarget,
								project: DashBoardData?.project?.id,
							},
						},
					},
				},
				{
					query: GET_DELIVERABLE_TRACKLINE_COUNT,
					variables: {
						filter: {
							deliverable_sub_target: value.deliverable_sub_target,
						},
					},
				},
			],
		});
	};
	const onUpdate = async (value: IDeliverableTargetLine) => {
		let currentDeliverableTarget = await getDeliverableTargetBySubTarget(
			apolloClient,
			value.deliverable_sub_target || ""
		);

		let DeliverableTargetLineId = value.id;
		delete (value as any).id;
		value.reporting_date = new Date(value.reporting_date);
		setDonorFormData(value.donorMapValues);
		let input = { ...value };

		let donorsForTracklineDonorForm = getProjectDonorsWithDonorsId(
			value.donors?.filter((item) => !!item),
			cachedProjectDonors?.projectDonors
		);
		setDonors(donorsForTracklineDonorForm);

		if (!input.annual_year) delete (input as any).annual_year;
		if (!input.financial_year) delete (input as any).financial_year;

		delete (input as any).donors;
		delete (input as any).donorMapValues;
		delete (input as any).attachments;

		updateDeliverableTrackLine({
			variables: {
				id: DeliverableTargetLineId,
				input,
			},
			refetchQueries: [
				{
					query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
					variables: {
						filter: {
							// deliverable_sub_target : value?.deliverable_sub_target,
						},
					},
				},
				{
					query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
					variables: {
						limit: 10,
						start: 0,
						sort: "created_at:DESC",
						filter: {
							// deliverable_sub_target : value?.deliverable_sub_target,
						},
					},
				},
				{
					query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
					variables: {
						limit: 10,
						start: 0,
						sort: "created_at:DESC",
						filter: {
							// deliverable_sub_target: value?.deliverable_sub_target,
						},
					},
				},

				// {
				// 	query: GET_ACHIEVED_VALLUE_BY_TARGET,
				// 	variables: {
				// 		filter: { deliverable_sub_target: value.deliverable_sub_target },
				// 	},
				// },
				{
					query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
					variables: {
						filter: { project: DashBoardData?.project?.id },
					},
				},
				{
					query: GET_DELIVERABLE_TRACKLINE_COUNT,
					variables: {
						filter: {
							deliverable_sub_target: {
								deliverable_target_project: currentDeliverableTarget,
								project: DashBoardData?.project?.id,
							},
						},
					},
				},
			],
		});
		props.handleClose();
	};
	const validate = (values: IDeliverableTargetLine) => {
		let errors: Partial<IDeliverableTargetLine> = {};
		if (!values.deliverable_sub_target) {
			errors.deliverable_sub_target = "Sub Target is required";
		}
		if (!values.reporting_date) {
			errors.reporting_date = "Date is required";
		}
		// if (!values.financial_year) {
		// 	errors.financial_year = "Financial Year is required";
		// }

		if (!isQualitativeParentTarrget && !values.value) {
			errors.value = "Target value is required";
		}
		if (isQualitativeParentTarrget && !values.value_qualitative) {
			errors.value_qualitative = "Target value is required";
		}

		return errors;
	};
	const onDelete = async () => {
		try {
			const reporting_date = new Date(initialValues?.reporting_date);
			const deliverableTracklineValues = { ...initialValues, reporting_date };
			delete deliverableTracklineValues["id"];
			delete deliverableTracklineValues["donors"];
			delete deliverableTracklineValues["donorMapValues"];
			!deliverableTracklineValues?.annual_year &&
				delete (deliverableTracklineValues as any)["annual_year"];
			!deliverableTracklineValues?.financial_year &&
				delete (deliverableTracklineValues as any)["financial_year"];
			delete deliverableTracklineValues["attachments"];
			await deleteDeliverableTrackLine({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...deliverableTracklineValues,
					},
				},
				refetchQueries: [
					// {
					// 	query: GET_ACHIEVED_VALLUE_BY_TARGET,
					// 	variables: {
					// 		filter: {
					// 			deliverableTargetProject: initialValues?.deliverable_target_project,
					// 		},
					// 	},
					// },
					{
						query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
						variables: {
							filter: { project: DashBoardData?.project?.id },
						},
					},
					{
						query: GET_DELIVERABLE_TRACKLINE_COUNT,
						variables: {
							filter: {
								deliverable_sub_target: initialValues?.deliverable_sub_target,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Deliverable Line Item Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	// let basicForm = (
	// 	<CommonForm
	// 		{...{
	// 			props.initialValues,
	// 			validate,
	// 			onCreate,
	// 			onCancel,
	// 			formAction,
	// 			onUpdate,
	// 			inputFields: deliverableTragetLineForm,
	// 		}}
	// 	/>
	// );
	let formDetails = currentTargetId && <FormDetailsCalculate currentTargetId={currentTargetId} />;

	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				handleClose={onCancel}
				open={props.open}
				title="Delete Deliverable Line Item"
				onDeleteConformation={onDelete}
			/>
		);
	}

	return (
		<React.Fragment>
			{/* {true ? <CircularPercentage progress={loadingPercentage} /> : null} */}
			<FormDialog
				title={newOrEdit + " " + formTitle}
				subtitle={formSubtitle}
				workspace={DashBoardData?.workspace?.name}
				project={DashBoardData?.project?.name}
				open={formIsOpen}
				handleClose={onCancel}
				formDetails={formDetails}
			>
				<>
					{/* <DeliverableStepper
						stepperHelpers={{ ̰
							activeStep,
							setActiveStep,
							handleNext,
							handleBack,
							handleReset, 
						}}
						basicForm={basicForm}  
						donorForm={donorForm}
					/> */}
					<CommonForm
						{...{
							initialValues,
							validate,
							onCreate,
							onCancel,
							formAction,
							onUpdate,
							inputFields: deliverableTragetLineForm,
						}}
					/>
					{openDeliverableTargetDialog && (
						<SubTarget
							formAction={FORM_ACTIONS.CREATE}
							open={openDeliverableTargetDialog}
							handleClose={() => setOpenDeliverableTargetDialog(false)}
							formType={props.formType}
						/>
					)}
				</>
			</FormDialog>

			{updateDeliverableTrackLineLoading ||
			uploadMorphLoading ||
			loading ||
			creatingProjectDonorsLoading ||
			deletingDeliverableTrackline ? (
				<FullScreenLoader />
			) : null}

			{openAttachFiles && (
				<AttachFileForm
					open={openAttachFiles}
					handleClose={() => setOpenAttachFiles(false)}
					filesArray={filesArray}
					setFilesArray={setFilesArray}
					parentOnSuccessCall={() => {
						if (props.type === DELIVERABLE_ACTIONS.UPDATE) {
							props?.reftechOnSuccess?.();
							refetchDocuments();
						}
					}}
					uploadApiConfig={{
						ref: "deliverable-tracking-lineitem",
						refId:
							props.type === DELIVERABLE_ACTIONS.UPDATE
								? props.data.id?.toString() || ""
								: "",
						field: "attachments",
						path: `org-${DashBoardData?.organization?.id}/project-${DashBoardData?.project?.id}/deliverable-tracking-lineitem`,
					}}
				/>
			)}
		</React.Fragment>
	);
}

export default DeliverableTrackLine;
