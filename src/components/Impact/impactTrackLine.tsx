import { ApolloClient, useApolloClient, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_ANNUAL_YEARS, GET_FINANCIAL_YEARS, GET_PROJECT_DONORS } from "../../graphql";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
} from "../../graphql/Impact/target";
import {
	CREATE_IMPACT_TRACKLINE,
	GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
	GET_IMPACT_TRACKLINE_COUNT,
	UPDATE_IMPACT_TRACKLINE,
} from "../../graphql/Impact/trackline";
import { IImpactTargetLine, ImpactTargetLineProps } from "../../models/impact/impactTargetline";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { getFetchPolicy, getTodaysDate, uploadPercentageCalculator } from "../../utils";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FORM_ACTIONS } from "../Forms/constant";
import { FullScreenLoader } from "../Loader/Loader";
import Stepper from "../Stepper/Stepper";
import { IMPACT_ACTIONS } from "./constants";
import ImpacTracklineDonorYearTags from "./impactTracklineDonor";
import { impactTragetLineForm } from "./inputField.json";
import {
	IGET_IMPACT_TRACKLINE_BY_TARGET,
	IImpactTracklineByTargetResponse,
} from "../../models/impact/query";
import { useIntl } from "react-intl";
import {
	CommonFormTitleFormattedMessage,
	CommonUploadingFilesMessage,
} from "../../utils/commonFormattedMessage";
import { AttachFile } from "../../models/AttachFile";
import AttachFileForm from "../Forms/AttachFiles";
import useMultipleFileUpload from "../../hooks/multipleFileUpload";
import { CircularPercentage, FormDetails } from "../commons";
import { GET_ALL_IMPACT_AMOUNT_SPEND } from "../../graphql/Impact/query";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { GET_PROJ_DONORS } from "../../graphql/project";
import { IGET_DONOR } from "../../models/donor/query";
import { IGetProjectDonor, IProjectDonor } from "../../models/project/project";
import { getProjectDonorsWithDonorsId } from "../Deliverable/DeliverableTrackline";
import ImpactTarget from "./impactTarget";
import Donor from "../Donor";
import { CREATE_PROJECT_DONOR } from "../../graphql/donor/mutation";
import { updateProjectDonorCache } from "../Project/Project";
import DeleteModal from "../DeleteModal";
import { DIALOG_TYPE } from "../../models/constants";

function getInitialValues(props: ImpactTargetLineProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		impact_target_project: props.impactTarget,
		annual_year: "",
		value: 0,
		financial_year: "",
		reporting_date: getTodaysDate(),
		note: "",
		donors: [],
	};
}
const FormDetailsCalculate = React.memo(
	({ currentTargetId }: { currentTargetId: string | number }) => {
		const { data: impactTargetResponse } = useQuery(GET_IMPACT_TARGET_BY_PROJECT, {
			variables: {
				filter: { id: currentTargetId },
			},
			fetchPolicy: getFetchPolicy(),
		});
		const { data: achivedValue } = useQuery(GET_ACHIEVED_VALLUE_BY_TARGET, {
			variables: { filter: { impactTargetProject: currentTargetId } },
		});

		const intl = useIntl();
		let impactCategoryLabel = intl.formatMessage({
			id: "impactCategoryLabelFormDetail",
			defaultMessage: "Category",
			description: "This text will be show on deliverable trackline form for impact category",
		});
		let impactTotalTargetLabel = intl.formatMessage({
			id: "impactTotalTargetLabelFormDetail",
			defaultMessage: "Target",
			description: "This text will be show on deliverable trackline form for impact category",
		});
		let impactAchievedTargetLabel = intl.formatMessage({
			id: "impactAchievedTargetLabelFormDetail",
			defaultMessage: "Achieved",
			description: "This text will be show on deliverable trackline form for impact category",
		});

		let fetchedImpactTarget = impactTargetResponse?.impactTargetProjectList[0];
		let formDetailsArray = fetchedImpactTarget
			? [
					{
						label: impactCategoryLabel,
						value: fetchedImpactTarget?.impact_category_org.name,
					},
					{
						label: impactTotalTargetLabel,
						value: `${fetchedImpactTarget.target_value} ${fetchedImpactTarget?.impact_units_org?.name}`,
					},
					{
						label: impactAchievedTargetLabel,
						value: `${achivedValue?.impactTrackingSpendValue} ${fetchedImpactTarget?.impact_units_org?.name}`,
					},
			  ]
			: [];

		return (
			<FormDetails formDetails={formDetailsArray} title={fetchedImpactTarget?.name || ""} />
		);
	}
);

const fetchImpactTracklineByTarget = async ({
	apolloClient,
	currentTargetId = "",
}: {
	apolloClient: ApolloClient<object>;
	currentTargetId: string | number | undefined;
}) => {
	try {
		await apolloClient.query({
			query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
			variables: {
				filter: {
					impact_target_project: currentTargetId,
				},
			},
		});
	} catch (err) {
		console.error(err);
	}
};

function ImpactTrackLine(props: ImpactTargetLineProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IImpactTargetLine = getInitialValues(props);
	const { data: getAnnualYears } = useQuery(GET_ANNUAL_YEARS);
	const apolloClient = useApolloClient();

	const { data: impactFyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: DashBoardData?.organization?.country?.id } },
	});

	const [stepperActiveStep, setStepperActiveStep] = React.useState(0);

	const { data: impactTargets } = useQuery(GET_IMPACT_TARGET_BY_PROJECT, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});

	useQuery(GET_PROJ_DONORS, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});

	useQuery(GET_ORG_DONOR, {
		variables: { filter: { organization: DashBoardData?.organization?.id } },
	});

	let cachedProjectDonorsForImpact: IGetProjectDonor | null = null;
	try {
		cachedProjectDonorsForImpact = apolloClient.readQuery<IGetProjectDonor>(
			{
				query: GET_PROJ_DONORS,
				variables: { filter: { project: DashBoardData?.project?.id } },
			},
			true
		);
	} catch (error) {
		console.error(error);
	}

	let cachedOrganizationDonorsForImpact: IGET_DONOR | null = null;
	try {
		cachedOrganizationDonorsForImpact = apolloClient.readQuery<IGET_DONOR>(
			{
				query: GET_ORG_DONOR,
				variables: { filter: { organization: DashBoardData?.organization?.id } },
			},
			true
		);
	} catch (error) {
		console.error(error);
	}
	const [createProjectDonor] = useMutation(CREATE_PROJECT_DONOR, {
		onCompleted: (data) => {
			updateProjectDonorCache({ apolloClient, projecttDonorCreated: data });
		},
	});

	const createProjectDonorHelper = (value: any) => {
		createProjectDonor({
			variables: {
				input: {
					project: DashBoardData?.project?.id,
					donor: value.id,
				},
			},
		});
	};

	impactTragetLineForm[3].customMenuOnClick = createProjectDonorHelper;

	const [donors, setDonors] = React.useState<
		{
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}[]
	>();

	const [impactDonorForm, setImpactDonorForm] = React.useState<React.ReactNode | undefined>();
	const [impactDonorFormData, setImpactDonorFormData] = React.useState<any>();

	const handleNext = () => {
		setStepperActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	const handleBack = () => {
		setStepperActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
	const handleReset = () => {
		setStepperActiveStep(0);
	};
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = () => {
		props.handleClose();
		handleReset();
	};
	const [openImpactTargetDialog, setOpenImpactTargetDialog] = React.useState<boolean>();
	impactTragetLineForm[0].addNewClick = () => setOpenImpactTargetDialog(true);

	const [openDonorDialog, setOpenDonorDialog] = React.useState<boolean>();
	impactTragetLineForm[3].addNewClick = () => setOpenDonorDialog(true);

	const [openAttachFiles, setOpenAttachFiles] = React.useState<boolean>();
	const [filesArray, setFilesArray] = React.useState<AttachFile[]>(
		props.type === IMPACT_ACTIONS.UPDATE
			? props.data.attachments
				? [...props.data.attachments]
				: []
			: []
	);

	/* Open Attach File Form*/
	impactTragetLineForm[7].onClick = () => setOpenAttachFiles(true);

	if (filesArray.length) impactTragetLineForm[7].label = "View Files";
	else impactTragetLineForm[7].label = "Attach Files";

	if (filesArray.length)
		impactTragetLineForm[7].textNextToButton = `${filesArray.length} files attached`;
	else impactTragetLineForm[7].textNextToButton = ``;

	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	const [currentTargetId, setCurrentTargetId] = React.useState<string | number | undefined>(
		props.impactTarget ? props.impactTarget : ""
	);

	let {
		multiplefileMorph,
		loading: uploadMorphLoading,
		success,
		setSuccess,
	} = useMultipleFileUpload(filesArray, setFilesArray);

	React.useMemo(() => {
		if (success && impactDonorForm) {
			if (props.type === IMPACT_ACTIONS.CREATE) {
				fetchImpactTracklineByTarget({ apolloClient, currentTargetId });
			} else if (props.type === IMPACT_ACTIONS.UPDATE && props.reftechOnSuccess) {
				props.reftechOnSuccess();
			}
			setSuccess(false);
			handleNext();
		}
	}, [success, currentTargetId, impactDonorForm]);

	impactTragetLineForm[0].getInputValue = setCurrentTargetId;

	const intl = useIntl();

	let formDetails = currentTargetId && <FormDetailsCalculate currentTargetId={currentTargetId} />;

	const [createImpactTrackline, { loading }] = useMutation(CREATE_IMPACT_TRACKLINE, {
		onCompleted(data) {
			multiplefileMorph({
				related_id: data.createImpactTrackingLineitemInput.id,
				related_type: "impact_tracking_lineitem",
				field: "attachments",
			});

			setImpactDonorForm(
				<ImpacTracklineDonorYearTags
					donors={donors}
					TracklineId={data.createImpactTrackingLineitemInput.id}
					TracklineFyId={data.createImpactTrackingLineitemInput.financial_year?.id}
					onCancel={onCancel}
					type={FORM_ACTIONS.CREATE}
				/>
			);

			notificationDispatch(setSuccessNotification("Impact Trackline created successfully!"));
		},
		onError(data) {
			notificationDispatch(setErrorNotification("Impact Trackline creation Failed !"));
		},
	});

	const [updateImpactTrackLine, { loading: updateImpactTrackLineLoading }] = useMutation(
		UPDATE_IMPACT_TRACKLINE,
		{
			onCompleted(data) {
				setImpactDonorForm(
					<ImpacTracklineDonorYearTags
						donors={donors}
						TracklineId={data.updateImpactTrackingLineitemInput.id}
						TracklineFyId={data.updateImpactTrackingLineitemInput.financial_year?.id}
						onCancel={onCancel}
						data={Object.keys(impactDonorFormData).length ? impactDonorFormData : {}}
						type={
							Object.keys(impactDonorFormData).length
								? FORM_ACTIONS.UPDATE
								: FORM_ACTIONS.CREATE
						}
						alreadyMappedDonorsIds={
							props.type === IMPACT_ACTIONS.UPDATE ? props.alreadyMappedDonorsIds : []
						}
					/>
				);

				notificationDispatch(
					setSuccessNotification("Impact Trackline Updated successfully!")
				);
				handleNext();
			},
			onError(err) {
				notificationDispatch(setErrorNotification("Impact Trackline Updation Failed !"));
			},
		}
	);
	const [deleteImpactTrackLine, { loading: deleteImpactTrackLineLoading }] = useMutation(
		UPDATE_IMPACT_TRACKLINE
	);

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (getAnnualYears) {
			impactTragetLineForm[4].optionsArray = getAnnualYears.annualYears;
		}
	}, [getAnnualYears]);

	// updating Impact Target field with fetched Target list
	useEffect(() => {
		if (impactTargets) {
			impactTragetLineForm[0].optionsArray = impactTargets.impactTargetProjectList;
		}
	}, [impactTargets]);

	impactTragetLineForm[3].optionsArray = useMemo(() => {
		let donorsArray: any = [];
		if (cachedProjectDonorsForImpact)
			cachedProjectDonorsForImpact.projectDonors.forEach((elem: IProjectDonor) => {
				if (
					props.type === IMPACT_ACTIONS.UPDATE &&
					props.alreadyMappedDonorsIds?.includes(elem.donor.id)
				) {
					donorsArray.push({
						...elem,
						id: elem.donor.id,
						name: elem.donor.name,
						disabled: true,
					});
				} else {
					donorsArray.push({
						...elem,
						id: elem.donor.id,
						name: elem.donor.name,
					});
				}
			});
		return donorsArray;
	}, [cachedProjectDonorsForImpact, props]);

	impactTragetLineForm[3].secondOptionsArray = useMemo(() => {
		let organizationMinusProjectDonors: any = [];
		if (cachedProjectDonorsForImpact && cachedOrganizationDonorsForImpact)
			cachedOrganizationDonorsForImpact.orgDonors.forEach(
				(orgDonor: { id: string; name: string }) => {
					let projectDonorNotContainsOrgDonor = true;
					cachedProjectDonorsForImpact?.projectDonors.forEach(
						(projectDonor: IProjectDonor) => {
							if (orgDonor.id === projectDonor.donor.id) {
								projectDonorNotContainsOrgDonor = false;
								return false;
							}
						}
					);
					if (projectDonorNotContainsOrgDonor)
						organizationMinusProjectDonors.push({
							...orgDonor,
						});
				}
			);
		return organizationMinusProjectDonors;
	}, [cachedProjectDonorsForImpact, cachedOrganizationDonorsForImpact]);

	// updating financial year field with fetched financial year list
	useEffect(() => {
		if (impactFyData) {
			impactTragetLineForm[5].optionsArray = impactFyData.financialYearList;
		}
	}, [impactFyData]);

	const onCreate = (value: IImpactTargetLine) => {
		value.reporting_date = new Date(value.reporting_date);

		// setSelectedImpactTarget(value.impact_target_project);
		let input = { ...value };
		if (!input.financial_year) delete (input as any).financial_year;
		if (!input.annual_year) delete (input as any).annual_year;

		let donorsForTracklineDonorForm = getProjectDonorsWithDonorsId(
			value.donors?.filter((item) => !!item),
			cachedProjectDonorsForImpact?.projectDonors
		);
		setDonors(donorsForTracklineDonorForm);

		delete (input as any).donors;
		createImpactTrackline({
			variables: { input },
			update: async (
				store,
				{ data: { createImpactTrackingLineitemInput: tracklineCreated } }
			) => {
				try {
					const count = await store.readQuery<{
						impactTrackingLineitemListCount: number;
					}>({
						query: GET_IMPACT_TRACKLINE_COUNT,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
						},
					});

					store.writeQuery<{ impactTrackingLineitemListCount: number }>({
						query: GET_IMPACT_TRACKLINE_COUNT,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
						},
						data: {
							impactTrackingLineitemListCount:
								count!.impactTrackingLineitemListCount + 1,
						},
					});

					let limit = 0;
					if (count) {
						limit = count.impactTrackingLineitemListCount;
					}
					const dataRead = await store.readQuery<IGET_IMPACT_TRACKLINE_BY_TARGET>({
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
							limit: limit > 10 ? 10 : limit,
							start: 0,
							sort: "created_at:DESC",
						},
					});
					let impactTrackingLineitemList: IImpactTracklineByTargetResponse[] = dataRead?.impactTrackingLineitemList
						? dataRead?.impactTrackingLineitemList
						: [];

					store.writeQuery<IGET_IMPACT_TRACKLINE_BY_TARGET>({
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
							limit: limit > 10 ? 10 : limit,
							start: 0,
							sort: "created_at:DESC",
						},
						data: {
							impactTrackingLineitemList: [
								...impactTrackingLineitemList,
								tracklineCreated,
							],
						},
					});

					store.writeQuery<IGET_IMPACT_TRACKLINE_BY_TARGET>({
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
						},
						data: {
							impactTrackingLineitemList: [
								...impactTrackingLineitemList,
								tracklineCreated,
							],
						},
					});
				} catch (err) {
					console.error(err);
				}
			},
			refetchQueries: [
				// {
				// 	query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
				// 	variables: {
				// 		filter: { impact_target_project: value.impact_target_project },
				// 	},
				// },
				{
					query: GET_ACHIEVED_VALLUE_BY_TARGET,
					variables: {
						filter: { impactTargetProject: value.impact_target_project },
					},
				},
				{
					query: GET_ALL_IMPACT_AMOUNT_SPEND,
					variables: {
						filter: { project: DashBoardData?.project?.id },
					},
				},
			],
		});
	};

	const onUpdate = (value: IImpactTargetLine) => {
		let impactTargetLineId = value.id;
		delete (value as any).id;
		value.reporting_date = new Date(value.reporting_date);

		setImpactDonorFormData(value.impactDonorMapValues);
		let input = { ...value };

		let donorsForTracklineDonorForm = getProjectDonorsWithDonorsId(
			value.donors?.filter((item) => !!item),
			cachedProjectDonorsForImpact?.projectDonors
		);
		setDonors(donorsForTracklineDonorForm);

		delete (input as any).donors;
		delete (input as any).impactDonorMapValues;
		delete (input as any).attachments;
		if (!input.financial_year) delete (input as any).financial_year;
		if (!input.annual_year) delete (input as any).annual_year;

		updateImpactTrackLine({
			variables: {
				id: impactTargetLineId,
				input,
			},
			refetchQueries: [
				// 	{
				// 		query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
				// 		variables: {
				// 			limit: 10,
				// 			start: 0,
				// 			sort: "created_at:DESC",
				// 			filter: { impact_target_project: value.impact_target_project },
				// 		},
				// 	},
				// 	{
				// 		query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
				// 		variables: {
				// 			filter: { impact_target_project: value.impact_target_project },
				// 		},
				// 	},
				{
					query: GET_ACHIEVED_VALLUE_BY_TARGET,
					variables: {
						filter: { impactTargetProject: value.impact_target_project },
					},
				},
				{
					query: GET_ALL_IMPACT_AMOUNT_SPEND,
					variables: {
						filter: { project: DashBoardData?.project?.id },
					},
				},
			],
		});
	};

	const validate = (values: IImpactTargetLine) => {
		let errors: Partial<IImpactTargetLine> = {};
		if (!values.impact_target_project) {
			errors.impact_target_project = "Target is required";
		}
		if (!values.reporting_date) {
			errors.reporting_date = "Date is required";
		}
		if (!values.value) {
			errors.value = "Value is required";
		}
		return errors;
	};

	const onDelete = async () => {
		try {
			const reporting_date = new Date(initialValues?.reporting_date);
			const impactTracklineValues = { ...initialValues, reporting_date };
			delete impactTracklineValues["id"];
			delete impactTracklineValues["donors"];
			delete impactTracklineValues["impactDonorMapValues"];
			!impactTracklineValues?.annual_year &&
				delete (impactTracklineValues as any)["annual_year"];
			!impactTracklineValues?.financial_year &&
				delete (impactTracklineValues as any)["financial_year"];
			delete impactTracklineValues["attachments"];
			await deleteImpactTrackLine({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...impactTracklineValues,
					},
				},
				refetchQueries: [
					{
						query: GET_ACHIEVED_VALLUE_BY_TARGET,
						variables: {
							filter: { impactTargetProject: initialValues?.impact_target_project },
						},
					},
					{
						query: GET_ALL_IMPACT_AMOUNT_SPEND,
						variables: {
							filter: { project: DashBoardData?.project?.id },
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Impact Line Item Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	let basicForm = (
		<CommonForm
			{...{
				initialValues,
				validate,
				onCreate,
				onCancel,
				formAction,
				onUpdate,
				inputFields: impactTragetLineForm,
			}}
		/>
	);

	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				handleClose={onCancel}
				open={props.open}
				title="Delete Impact Line Item"
				onDeleteConformation={onDelete}
			/>
		);
	}

	return (
		<React.Fragment>
			<FormDialog
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "impactAchievementFormTitle",
						defaultMessage: "Impact Achievement",
						description: `This text will be show on Impact Achievement form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "impactAchievementFormSubtitle",
					defaultMessage:
						"Physical addresses of your organisation like headquarter branch etc",
					description: `This text will be show on Impact Achievement form for subtitle`,
				})}
				workspace={DashBoardData?.workspace?.name}
				project={DashBoardData?.project?.name}
				open={formIsOpen}
				handleClose={onCancel}
				formDetails={formDetails}
			>
				<Stepper
					stepperHelpers={{
						activeStep: stepperActiveStep,
						setActiveStep: setStepperActiveStep,
						handleNext: handleNext,
						handleBack: handleBack,
						handleReset: handleReset,
					}}
					basicForm={basicForm}
					donorForm={impactDonorForm}
				/>

				{openImpactTargetDialog && (
					<ImpactTarget
						type={IMPACT_ACTIONS.CREATE}
						open={openImpactTargetDialog}
						handleClose={() => setOpenImpactTargetDialog(false)}
						project={DashBoardData?.project?.id}
					/>
				)}
				{openDonorDialog && (
					<Donor
						open={openDonorDialog}
						formAction={FORM_ACTIONS.CREATE}
						handleClose={() => setOpenDonorDialog(false)}
					/>
				)}
			</FormDialog>

			{updateImpactTrackLineLoading ||
			uploadMorphLoading ||
			deleteImpactTrackLineLoading ||
			loading ? (
				<FullScreenLoader />
			) : null}
			{openAttachFiles && (
				<AttachFileForm
					open={openAttachFiles}
					handleClose={() => setOpenAttachFiles(false)}
					filesArray={filesArray}
					setFilesArray={setFilesArray}
					parentOnSuccessCall={
						props.type === IMPACT_ACTIONS.UPDATE && props.reftechOnSuccess
							? props.reftechOnSuccess
							: undefined
					}
					uploadApiConfig={{
						ref: "impact-tracking-lineitem",
						refId:
							props.type === IMPACT_ACTIONS.UPDATE
								? props.data.id?.toString() || ""
								: "",
						field: "attachments",
						path: `org-${DashBoardData?.organization?.id}/project-${DashBoardData?.project?.id}/impact-tracking-lineitem`,
					}}
				/>
			)}
		</React.Fragment>
	);
}

export default ImpactTrackLine;
