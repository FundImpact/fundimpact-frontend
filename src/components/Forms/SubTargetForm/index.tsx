import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	// UPDATE_DELIVERABLE_TARGET,
} from "../../../graphql/Deliverable/target";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import CommonForm from "../../CommonForm/commonForm";
import FormDialog from "../../FormDialog/FormDialog";
import { FullScreenLoader } from "../../Loader/Loader";
import { FORM_ACTIONS } from "../constant";
import { budgetSubTargetForm } from "./inputFIelds.json";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../../utils/commonFormattedMessage";
import {
	GET_ALL_DELIVERABLES_TARGET_AMOUNT,
	GET_PROJECT_BUDGET_AMOUNT,
	GET_PROJ_DONORS,
} from "../../../graphql/project";
import { GET_YEARTAGS } from "../../../graphql/yearTags/query";
import { YearTagPayload } from "../../../models/yearTags";
import { IGetProjectDonor, IProjectDonor } from "../../../models/project/project";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { IGET_DONOR } from "../../../models/donor/query";
import { GET_GRANT_PERIOD } from "../../../graphql";
import { ISubTarget, SubTargetFormProps } from "../../../models/common/subtarget";
import {
	GET_BUDGET_SUB_TARGETS,
	GET_BUDGET_SUB_TARGETS_COUNT,
	GET_BUDGET_TARGET_PROJECT,
} from "../../../graphql/Budget";
import {
	CREATE_BUDGET_SUB_TARGET,
	UPDATE_BUDGET_SUB_TARGET,
} from "../../../graphql/Budget/mutation";
import {
	CREATE_DELIVERABLE_SUB_TARGET,
	GET_DELIVERABLE_SUB_TARGETS,
	GET_DELIVERABLE_SUB_TARGETS_COUNT,
	UPDATE_DELIVERABLE_SUB_TARGET,
} from "../../../graphql/Deliverable/subTarget";
import Donor from "../../Donor";
import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";
import { DELIVERABLE_TYPE } from "../../../models/constants";
// import { IDeliverableTarget } from "../../../models/deliverable/deliverableTarget";
import { CREATE_PROJECT_DONOR, UPDATE_PROJECT_DONOR } from "../../../graphql/donor/mutation";
import { updateProjectDonorCache } from "../../Project/Project";
import { DONOR_DIALOG_TYPE } from "../../../models/donor/constants";

function getInitialValues(props: SubTargetFormProps) {
	if (props.formAction === FORM_ACTIONS.UPDATE) return { ...props.data };
	return {
		budget_targets_project: props?.target,
		deliverable_target_project: props?.target,
		impact_target_project: props?.target,
		project: null,
		target_value: 0,
		timeperiod_start: null,
		timeperiod_end: null,
		financial_year_org: null,
		financial_year_donor: null,
		annual_year: null,
		grant_periods_project: null,
		donor: null,
	};
}
function SubTarget(props: SubTargetFormProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();

	const { data: deliverableTargets } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: {
			filter: {
				project_with_deliverable_targets: {
					project: dashboardData?.project?.id,
				},
				type: props.formType,
				sub_target_required: true,
			},
		},
		fetchPolicy: "network-only",
		skip:
			props.formType !== "budget"
				? !Object.values(DELIVERABLE_TYPE).includes(props.formType)
				: true,
	});

	const { data: budgetTargets } = useQuery(GET_BUDGET_TARGET_PROJECT, {
		variables: {
			filter: {
				project_with_budget_targets: {
					project: dashboardData?.project?.id,
				},
			},
		},
		skip: props.formType !== "budget",
	});

	if (props.formAction === FORM_ACTIONS.UPDATE) {
		budgetSubTargetForm[0].hidden = true;
	} else {
		budgetSubTargetForm[0].hidden = false;
	}

	// const [updateDeliverableTarget] = useMutation(UPDATE_DELIVERABLE_TARGET);

	const [isQualitativeParent, setIsQualitativeParent] = useState(
		props.qualitativeParent || false
	);

	const [targetValueOptions, setTargetValueOptions] = useState(props.targetValueOptions || []);

	useEffect(() => {
		if (isQualitativeParent) {
			budgetSubTargetFormList[2].hidden = true;
			budgetSubTargetFormList[3].hidden = false;
		} else {
			budgetSubTargetFormList[2].hidden = false;
			budgetSubTargetFormList[3].hidden = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isQualitativeParent]);

	const getCreateSubTargetQuery = () =>
		props.formType === "budget"
			? CREATE_BUDGET_SUB_TARGET
			: Object.values(DELIVERABLE_TYPE).includes(props.formType)
			? CREATE_DELIVERABLE_SUB_TARGET
			: CREATE_BUDGET_SUB_TARGET;

	const getUpdateSubTargetQuery = () =>
		props.formType === "budget"
			? UPDATE_BUDGET_SUB_TARGET
			: Object.values(DELIVERABLE_TYPE).includes(props.formType)
			? UPDATE_DELIVERABLE_SUB_TARGET
			: UPDATE_BUDGET_SUB_TARGET;

	const getFetchSubTargetQuery = () =>
		props.formType === "budget"
			? GET_BUDGET_SUB_TARGETS
			: Object.values(DELIVERABLE_TYPE).includes(props.formType)
			? GET_DELIVERABLE_SUB_TARGETS
			: GET_BUDGET_SUB_TARGETS;

	const getCountSubTargetQuery = () =>
		props.formType === "budget"
			? GET_BUDGET_SUB_TARGETS_COUNT
			: Object.values(DELIVERABLE_TYPE).includes(props.formType)
			? GET_DELIVERABLE_SUB_TARGETS_COUNT
			: GET_BUDGET_SUB_TARGETS_COUNT;

	const getProjectCardQueryRefetch = () =>
		props.formType === "budget"
			? GET_PROJECT_BUDGET_AMOUNT
			: Object.values(DELIVERABLE_TYPE).includes(props.formType)
			? GET_ALL_DELIVERABLES_TARGET_AMOUNT
			: GET_PROJECT_BUDGET_AMOUNT;

	const [createSubTarget, { loading: createSubTargetLoading }] = useMutation(
		getCreateSubTargetQuery()
	);
	const [updateSubTarget, { loading: updateSubTargetLoading }] = useMutation(
		getUpdateSubTargetQuery()
	);

	let budgetSubTargetFormList: any = budgetSubTargetForm;

	const getTargetId = () =>
		props.formType === "budget"
			? "budget_targets_project"
			: Object.values(DELIVERABLE_TYPE).includes(props.formType)
			? "deliverable_target_project"
			: "budget_targets_project";

	const getTargetOptions = () =>
		props.formType === "budget"
			? budgetTargets?.projectBudgetTargets || []
			: Object.values(DELIVERABLE_TYPE).includes(props.formType)
			? deliverableTargets?.deliverableTargetList || []
			: "";

	budgetSubTargetFormList[0].name = getTargetId();
	budgetSubTargetFormList[0].optionsArray = getTargetOptions();

	const [currentDonor, setCurrentDonor] = useState<null | string | number>(null);

	const { data: grantPeriods } = useQuery(GET_GRANT_PERIOD, {
		variables: { filter: { donor: currentDonor, project: dashboardData?.project?.id } },
		skip: !currentDonor || !dashboardData?.project?.id,
	});

	const [lists, setList] = useState<{
		annualYear: YearTagPayload[];
		financialYear: YearTagPayload[];
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
			annualYear: YearTagPayload[];
			financialYear: YearTagPayload[];
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

	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const formAction = props.formAction;

	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);

	const apolloClient = useApolloClient();

	let projectDonors: IGetProjectDonor | null = null;

	const [openDonorDialog, setOpenDonorDialog] = React.useState<boolean>();
	budgetSubTargetFormList[6].addNewClick = () => setOpenDonorDialog(true);

	try {
		projectDonors = apolloClient.readQuery<IGetProjectDonor>(
			{
				query: GET_PROJ_DONORS,
				variables: { filter: { project: dashboardData?.project?.id } },
			},
			true
		);
	} catch (error) {
		console.error(error);
	}

	let orgDonors: IGET_DONOR | null = null;
	try {
		orgDonors = apolloClient.readQuery<IGET_DONOR>(
			{
				query: GET_ORG_DONOR,
				variables: { filter: { organization: dashboardData?.organization?.id } },
			},
			true
		);
	} catch (error) {
		console.error(error);
	}

	// const { data: projectDonors } = useQuery(GET_PROJ_DONORS, {
	// 	variables: { filter: { project: dashboardData?.project?.id, deleted: false }

	// },
	// });

	// const { data: orgDonors } = useQuery(GET_ORG_DONOR, {
	// 	variables: { filter: { organization: dashboardData?.organization?.id, deleted: false } },
	// });

	const [createProjectDonor] = useMutation(CREATE_PROJECT_DONOR, {
		onCompleted: (data) => {
			updateProjectDonorCache({ apolloClient, projecttDonorCreated: data });
		},
	});

	const [updateProjectDonor] = useMutation(UPDATE_PROJECT_DONOR);

	const getProjectDonorIdForGivenDonorId = (
		projectDonors: IGetProjectDonor["projectDonors"] | undefined,
		donorId: any
	) => projectDonors?.find((projectDonor) => projectDonor?.donor?.id === donorId)?.id;

	const createProjectDonorHelper = (value: any) => {
		const projectDonorIdForGivenDonor = getProjectDonorIdForGivenDonorId(
			projectDonors?.projectDonors,
			value.id
		);
		if (projectDonorIdForGivenDonor) {
			updateProjectDonor({
				variables: {
					id: projectDonorIdForGivenDonor,
					input: {
						project: dashboardData?.project?.id,
						donor: value.id,
						deleted: false,
					},
				},
			});
		} else {
			createProjectDonor({
				variables: {
					input: {
						project: dashboardData?.project?.id,
						donor: value.id,
					},
				},
			});
		}
	};
	budgetSubTargetFormList[6].customMenuOnClick = createProjectDonorHelper;

	budgetSubTargetFormList[6].optionsArray = useMemo(() => {
		let donorsArray: any = [];
		if (projectDonors)
			projectDonors?.projectDonors.forEach((elem: IProjectDonor) => {
				donorsArray.push({
					...elem,
					id: elem.donor.id,
					name: elem.donor.name,
				});
			});
		return donorsArray;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectDonors, props]);

	budgetSubTargetFormList[6].secondOptionsArray = useMemo(() => {
		let organizationDonorsAfterRemovingProjectDonors: any = [];
		if (projectDonors && orgDonors) {
			console.log("orgDonors --- ", projectDonors, orgDonors);
			orgDonors.orgDonors.forEach((orgDonor: { id: string; name: string }) => {
				let projectDonorNotContainsOrgDonor = true;
				projectDonors?.projectDonors.forEach((projectDonor: IProjectDonor) => {
					if (orgDonor.id === projectDonor.donor.id) {
						projectDonorNotContainsOrgDonor = false;
					}
				});
				if (projectDonorNotContainsOrgDonor)
					organizationDonorsAfterRemovingProjectDonors.push({
						...orgDonor,
					});
			});
		}
		return organizationDonorsAfterRemovingProjectDonors;
	}, [projectDonors, orgDonors]);

	useMemo(() => {
		if (props.formAction === FORM_ACTIONS.UPDATE) {
			if (props?.data?.donor) {
				setCurrentDonor(props?.data?.donor || "");
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.formAction]);

	budgetSubTargetFormList[0].getInputValue = (targetId: string) => {
		if (props.formType === "budget") {
			return;
		} else if (Object.values(DELIVERABLE_TYPE).includes(props.formType)) {
			let targetOptions = getTargetOptions();
			let target = targetOptions.find((elem: any) => elem.id === targetId);
			console.log("target", target);
			setIsQualitativeParent(target?.is_qualitative || false);
			setTargetValueOptions(target?.value_qualitative_option?.options || []);
		}
	};

	budgetSubTargetFormList[3].optionsArray = targetValueOptions;

	budgetSubTargetFormList[6].getInputValue = (donorId: string) => {
		setCurrentDonor(donorId);
	};
	budgetSubTargetFormList[7].optionsArray = lists.financialYear;
	budgetSubTargetFormList[9].optionsArray = lists.financialYear;
	budgetSubTargetFormList[10].optionsArray = lists.annualYear;

	const [openGrantPeriodForm, setOpenGrantPeriodForm] = useState(false);
	budgetSubTargetFormList[8].addNewClick = () => setOpenGrantPeriodForm(true);
	budgetSubTargetFormList[8].optionsArray = useMemo(() => grantPeriods?.grantPeriodsProjectList, [
		grantPeriods,
	]);

	const createSubTargetHelper = async (
		subTargetValues: ISubTarget,
		updateDeliverableTarget?: () => Promise<void>
	) => {
		try {
			let queryFilter: any = {
				[getTargetId()]: {
					id: subTargetValues[getTargetId()],
				},
				project: dashboardData?.project?.id,
			};

			let projectSubTargetsQueryFilter = undefined;

			if (
				props.formType !== "budget" &&
				Object.values(DELIVERABLE_TYPE).includes(props.formType)
			) {
				queryFilter[getTargetId()].type = props.formType;
				projectSubTargetsQueryFilter = {
					[getTargetId()]: {
						type: props.formType,
					},
				};
			}

			await createSubTarget({
				variables: {
					input: {
						data: subTargetValues,
					},
				},
				refetchQueries: [
					{
						query: getFetchSubTargetQuery(),
						variables: {
							filter: queryFilter,
						},
					},
					{
						query: getFetchSubTargetQuery(),
						variables: {
							filter: {
								project: dashboardData?.project?.id,
								...projectSubTargetsQueryFilter,
							},
						},
					},
					{
						query: getCountSubTargetQuery(),
						variables: {
							filter: queryFilter,
						},
					},
					{
						query: getFetchSubTargetQuery(),
						variables: {
							filter: queryFilter,
							limit: 10,
							start: 0,
							sort: "created_at:DESC",
						},
					},
					{
						query: getFetchSubTargetQuery(),
						variables: {
							filter: {
								[getTargetId()]: subTargetValues[getTargetId()],
								project: dashboardData?.project?.id,
							},
							sort: "created_at:DESC",
						},
					},
					{
						query: getCountSubTargetQuery(),
						variables: {
							filter: queryFilter,
						},
					},
					{
						query: getProjectCardQueryRefetch(),
						variables: {
							filter: {
								project: dashboardData?.project?.id,
								...projectSubTargetsQueryFilter,
							},
						},
					},
					{
						query: getProjectCardQueryRefetch(),
						variables: {
							filter: {
								project: dashboardData?.project?.id,
								...projectSubTargetsQueryFilter,
							},
						},
					},
				],
			});
			if (updateDeliverableTarget) await updateDeliverableTarget();
			notificationDispatch(setSuccessNotification("Sub Target created successfully !"));
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const updateSubTargetHelper = async (subTargetValues: ISubTarget) => {
		let subTargetId = subTargetValues.id;
		delete (subTargetValues as any).id;

		let projectSubTargetsQueryFilter = undefined;
		let queryFilter = {
			[getTargetId()]: subTargetValues[getTargetId()],
			project: dashboardData?.project?.id,
		};
		if (
			props.formType !== "budget" &&
			Object.values(DELIVERABLE_TYPE).includes(props.formType)
		) {
			projectSubTargetsQueryFilter = {
				[getTargetId()]: {
					type: props.formType,
				},
			};
		}

		try {
			await updateSubTarget({
				variables: {
					input: {
						where: {
							id: subTargetId,
						},
						data: subTargetValues,
					},
				},
				refetchQueries: [
					{
						query: getProjectCardQueryRefetch(),
						variables: {
							filter: {
								project: dashboardData?.project?.id,
								...projectSubTargetsQueryFilter,
							},
						},
					},
					{
						query: getCountSubTargetQuery(),
						variables: {
							filter: queryFilter,
							...projectSubTargetsQueryFilter,
						},
					},
					{
						query: getFetchSubTargetQuery(),
						variables: {
							filter: {
								project: dashboardData?.project?.id,
								...projectSubTargetsQueryFilter,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Sub Target updated successfully !"));
			onCancel();
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error?.message));
		}
	};

	let initialValues: any = getInitialValues(props);

	const checkValuesToDelete = (value: ISubTarget) => {
		let values = { ...value };
		if (props.formType === "budget") {
			delete values["deliverable_target_project"];
			delete values["impact_target_project"];
		} else if (Object.values(DELIVERABLE_TYPE).includes(props.formType)) {
			delete values["budget_targets_project"];
			delete values["impact_target_project"];
		}
		// if (props.formType === "impact") {
		// 	delete values["budget_targets_project"];
		// 	delete values["impact_target_project"];
		// }
		return values;
	};

	const onCreate = async (value: ISubTarget) => {
		value = checkValuesToDelete(value);
		// let targetOfCurrentSubTarget: IDeliverableTarget | null = null;

		// if (props.formType != "budget" && Object.values(DELIVERABLE_TYPE).includes(props.formType))
		// 	targetOfCurrentSubTarget = getTargetOptions().find(
		// 		(elem: IDeliverableTarget) => elem.id === value.deliverable_target_project
		// 	);

		// if (
		// 	targetOfCurrentSubTarget?.is_qualitative &&
		// 	targetOfCurrentSubTarget?.sub_target_required
		// ) {
		// 	const updateDeliverableTargetSubTargetRequired = async () => {
		// 		await updateDeliverableTarget({
		// 			variables: {
		// 				id: targetOfCurrentSubTarget?.id,
		// 				input: {
		// 					sub_target_required: false,
		// 				},
		// 			},
		// 		});
		// 	};
		// 	await createSubTargetHelper(
		// 		{ ...value, project: dashboardData?.project?.id || "" },
		// 		updateDeliverableTargetSubTargetRequired
		// 	);
		// } else
		await createSubTargetHelper({ ...value, project: dashboardData?.project?.id || "" });
	};

	const onUpdate = async (value: any) => {
		value = checkValuesToDelete(value);
		await updateSubTargetHelper({ ...value });
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		if (props.formAction === FORM_ACTIONS.CREATE) {
			if (!isQualitativeParent && !values.target_value) {
				errors.target_value = "Target value is required";
			}
			if (isQualitativeParent && !values.target_value_qualitative) {
				errors.target_value = "Target value is required";
			}
		}

		if (props.formAction === FORM_ACTIONS.UPDATE) {
			if (!values.project) {
				errors.project = "Project is required";
			}
			if (!isQualitativeParent && !values.target_value) {
				errors.target_value = "Target value is required";
			}
			if (isQualitativeParent && !values.target_value_qualitative) {
				errors.target_value = "Target value is required";
			}
		}
		return errors;
	};
	const intl = useIntl();

	let budgetSubTargetTitle = intl.formatMessage({
		id: "budgetSubTargetFormListTitle",
		defaultMessage: "Create Budget Sub-target",
		description: `This text will be show on budget sub target form for title`,
	});

	let deliverableSubTargetTitle = intl.formatMessage({
		id: "deliverableSubTargetFormTitle",
		defaultMessage: "Create Deliverable Sub-target",
		description: `This text will be show on deliverable sub target form for title`,
	});

	let impactSubTargetTitle = intl.formatMessage({
		id: "impactSubTargetFormTitle",
		defaultMessage: "Create Impact Sub-target",
		description: `This text will be show on impact sub target form for title`,
	});

	let outcomeSubTargetTitle = intl.formatMessage({
		id: "outcomeSubTargetFormTitle",
		defaultMessage: "Create Outcome Sub-target",
		description: `This text will be show on outcome sub target form for title`,
	});
	let outputSubTargetTitle = intl.formatMessage({
		id: "outputSubTargetFormTitle",
		defaultMessage: "Create Output Sub-target",
		description: `This text will be show on output sub target form for title`,
	});
	let activitySubTargetTitle = intl.formatMessage({
		id: "activitySubTargetFormTitle",
		defaultMessage: "Create Activity Sub-target",
		description: `This text will be show on activity sub target form for title`,
	});
	const getTitle = () =>
		props.formType === "budget"
			? budgetSubTargetTitle
			: props.formType === "deliverable"
			? deliverableSubTargetTitle
			: props.formType === "impact"
			? impactSubTargetTitle
			: props.formType === "output"
			? outputSubTargetTitle
			: props.formType === "outcome"
			? outcomeSubTargetTitle
			: props.formType === "activity"
			? activitySubTargetTitle
			: "";

	let currentTitle = getTitle();

	useEffect(() => {
		console.log("budgetSubTargetFormList: ", budgetSubTargetFormList);
	}, [budgetSubTargetFormList]);

	return (
		<React.Fragment>
			<FormDialog
				title={newOrEdit + " " + currentTitle}
				subtitle={intl.formatMessage({
					id: "budgetSubTargetFormListSubtitle",
					defaultMessage:
						"You can create sub-targets to track your budget across time period, geography etc",
					description: `This text will be show on deliverable target form for subtitle`,
				})}
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate: onCreate,
						onCancel,
						formAction,
						onUpdate: onUpdate,
						inputFields: budgetSubTargetFormList,
					}}
				/>

				{openGrantPeriodForm && (
					<GrantPeriodDialog
						open={openGrantPeriodForm}
						onClose={() => setOpenGrantPeriodForm(false)}
						action={FORM_ACTIONS.CREATE}
					/>
				)}
				{openDonorDialog && (
					<Donor
						open={openDonorDialog}
						formAction={FORM_ACTIONS.CREATE}
						handleClose={() => setOpenDonorDialog(false)}
						dialogType={DONOR_DIALOG_TYPE.PROJECT}
						projectId={`${dashboardData?.project?.id}`}
					/>
				)}
			</FormDialog>
			{createSubTargetLoading ? <FullScreenLoader /> : null}
			{updateSubTargetLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default SubTarget;
