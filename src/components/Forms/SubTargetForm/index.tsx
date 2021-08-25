import { useApolloClient, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import { GET_DELIVERABLE_TARGET_BY_PROJECT } from "../../../graphql/Deliverable/target";
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
import { GET_PROJ_DONORS } from "../../../graphql/project";
import Deliverable from "../../Deliverable/Deliverable";
import DeliverableUnit from "../../Deliverable/DeliverableUnit";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import { GET_YEARTAGS } from "../../../graphql/yearTags/query";
import { YearTagPayload } from "../../../models/yearTags";
import { IGetProjectDonor, IProjectDonor } from "../../../models/project/project";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { IGET_DONOR } from "../../../models/donor/query";
import { GET_GRANT_PERIOD } from "../../../graphql";
import { ISubTarget, SubTargetFormProps } from "../../../models/common/subtarget";
import { GET_IMPACT_TARGET_BY_PROJECT } from "../../../graphql/Impact/target";
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
import {
	CREATE_IMPACT_SUB_TARGET,
	GET_IMPACT_SUB_TARGETS,
	GET_IMPACT_SUB_TARGETS_COUNT,
	UPDATE_IMPACT_SUB_TARGET,
} from "../../../graphql/Impact/subTarget";

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
		variables: { filter: { project: dashboardData?.project?.id } },
		skip: props.formType != "deliverable",
	});

	const { data: impactTargets } = useQuery(GET_IMPACT_TARGET_BY_PROJECT, {
		variables: { filter: { project: dashboardData?.project?.id } },
		skip: props.formType != "impact",
	});

	const { data: budgetTargets } = useQuery(GET_BUDGET_TARGET_PROJECT, {
		variables: { filter: { project: dashboardData?.project?.id } },
		skip: props.formType != "budget",
	});

	const getCreateSubTargetQuery = () =>
		props.formType === "budget"
			? CREATE_BUDGET_SUB_TARGET
			: props.formType === "deliverable"
			? CREATE_DELIVERABLE_SUB_TARGET
			: props.formType === "impact"
			? CREATE_IMPACT_SUB_TARGET
			: CREATE_BUDGET_SUB_TARGET;

	const getUpdateSubTargetQuery = () =>
		props.formType === "budget"
			? UPDATE_BUDGET_SUB_TARGET
			: props.formType === "deliverable"
			? UPDATE_DELIVERABLE_SUB_TARGET
			: props.formType === "impact"
			? UPDATE_IMPACT_SUB_TARGET
			: UPDATE_BUDGET_SUB_TARGET;

	const getFetchSubTargetQuery = () =>
		props.formType === "budget"
			? GET_BUDGET_SUB_TARGETS
			: props.formType === "deliverable"
			? GET_DELIVERABLE_SUB_TARGETS
			: props.formType === "impact"
			? GET_IMPACT_SUB_TARGETS
			: GET_BUDGET_SUB_TARGETS;

	const getCountSubTargetQuery = () =>
		props.formType === "budget"
			? GET_BUDGET_SUB_TARGETS_COUNT
			: props.formType === "deliverable"
			? GET_DELIVERABLE_SUB_TARGETS_COUNT
			: props.formType === "impact"
			? GET_IMPACT_SUB_TARGETS_COUNT
			: GET_BUDGET_SUB_TARGETS_COUNT;

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
			: props.formType === "deliverable"
			? "deliverable_target_project"
			: props.formType === "impact"
			? "impact_target_project"
			: "budget_targets_project";

	const getTargetOptions = () =>
		props.formType === "budget"
			? budgetTargets?.projectBudgetTargets || []
			: props.formType === "deliverable"
			? deliverableTargets?.deliverableTargetList || []
			: props.formType === "impact"
			? impactTargets?.impactTargetProjectList || []
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

	const [openDeliverableCategoryDialog, setOpenDeliverableCategoryDialog] = useState<boolean>();
	budgetSubTargetFormList[2].addNewClick = () => setOpenDeliverableCategoryDialog(true);

	const [openDeliverableUnitDialog, setOpenDeliverableUnitDialog] = useState<boolean>();
	budgetSubTargetFormList[3].addNewClick = () => setOpenDeliverableUnitDialog(true);

	const apolloClient = useApolloClient();

	let cachedProjectDonors: IGetProjectDonor | null = null;
	try {
		cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>(
			{
				query: GET_PROJ_DONORS,
				variables: { filter: { project: dashboardData?.project?.id } },
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
				variables: { filter: { organization: dashboardData?.organization?.id } },
			},
			true
		);
	} catch (error) {
		console.error(error);
	}

	budgetSubTargetFormList[4].optionsArray = useMemo(() => {
		let donorsArray: any = [];
		if (cachedProjectDonors)
			cachedProjectDonors?.projectDonors
				.filter((projectDonor) => !projectDonor?.deleted)
				.forEach((elem: IProjectDonor) => {
					donorsArray.push({
						...elem,
						id: elem.donor.id,
						name: elem.donor.name,
					});
				});
		return donorsArray;
	}, [cachedProjectDonors, props]);

	budgetSubTargetFormList[4]["secondOptionsArray"] = useMemo(() => {
		let organizationDonorsAfterRemovingProjectDonors: any = [];
		if (cachedProjectDonors && cachedOrganizationDonors)
			cachedOrganizationDonors.orgDonors.forEach((orgDonor: { id: string; name: string }) => {
				let projectDonorNotContainsOrgDonor = true;
				cachedProjectDonors?.projectDonors.forEach((projectDonor: IProjectDonor) => {
					if (orgDonor.id === projectDonor.donor.id && !projectDonor.deleted) {
						projectDonorNotContainsOrgDonor = false;
						return false;
					}
				});
				if (projectDonorNotContainsOrgDonor)
					organizationDonorsAfterRemovingProjectDonors.push({
						...orgDonor,
					});
			});
		return organizationDonorsAfterRemovingProjectDonors;
	}, [cachedProjectDonors, cachedOrganizationDonors]);

	useMemo(() => {
		if (props.formAction === FORM_ACTIONS.UPDATE) {
			if (props?.data?.donor) {
				setCurrentDonor(props?.data?.donor || "");
			}
		}
	}, [props.formAction]);

	budgetSubTargetFormList[4].getInputValue = (donorId: string) => {
		setCurrentDonor(donorId);
	};
	budgetSubTargetFormList[5].optionsArray = lists.financialYear;
	budgetSubTargetFormList[7].optionsArray = lists.financialYear;
	budgetSubTargetFormList[8].optionsArray = lists.annualYear;
	budgetSubTargetFormList[6].optionsArray = useMemo(() => grantPeriods?.grantPeriodsProjectList, [
		grantPeriods,
	]);

	const createSubTargetHelper = async (subTargetValues: ISubTarget) => {
		try {
			let queryFilter = {
				[getTargetId()]: subTargetValues[getTargetId()],
			};
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
						query: getCountSubTargetQuery(),
						variables: {
							filter: queryFilter,
							limit: 10,
							start: 0,
							sort: "created_at:DESC",
						},
					},
				],
			});
			// setcurrentCategory("");
			notificationDispatch(setSuccessNotification("Sub Target created successfully !"));
		} catch (error) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const updateSubTargetHelper = async (subTargetValues: ISubTarget) => {
		let subTargetId = subTargetValues.id;
		delete (subTargetValues as any).id;
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
			});
			notificationDispatch(setSuccessNotification("Sub Target updated successfully !"));
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification(error?.message));
		}
	};

	let initialValues: any = getInitialValues(props);

	const checkValuesToDelete = (value: ISubTarget) => {
		let values = { ...value };
		if (props.formType === "budget") {
			delete values["deliverable_target_project"];
			delete values["impact_target_project"];
		}
		if (props.formType === "deliverable") {
			delete values["budget_targets_project"];
			delete values["impact_target_project"];
		}
		if (props.formType === "impact") {
			delete values["budget_targets_project"];
			delete values["deliverable_target_project"];
		}
		return values;
	};

	const onCreate = async (value: ISubTarget) => {
		value = checkValuesToDelete(value);
		await createSubTargetHelper({ ...value, project: dashboardData?.project?.id || "" });
	};

	const onUpdate = async (value: any) => {
		value = checkValuesToDelete(value);
		await updateSubTargetHelper({ ...value });
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		if (props.formAction === FORM_ACTIONS.CREATE) {
			if (!values.target_value) {
				errors.target_value = "Target value is required";
			}
		}

		if (props.formAction === FORM_ACTIONS.UPDATE) {
			if (!values.project) {
				errors.project = "Project is required";
			}
			if (!values.target_value) {
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

	const getTitle = () =>
		props.formType === "budget"
			? budgetSubTargetTitle
			: props.formType === "deliverable"
			? deliverableSubTargetTitle
			: props.formType === "impact"
			? impactSubTargetTitle
			: "";

	let currentTitle = getTitle();

	return (
		<React.Fragment>
			<FormDialog
				title={currentTitle}
				subtitle={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "budgetSubTargetFormListSubtitle",
						defaultMessage:
							"Physical addresses of your organisation like headquarter branch etc",
						description: `This text will be show on deliverable target form for subtitle`,
					})
				}
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
				{openDeliverableCategoryDialog && (
					<Deliverable
						type={DELIVERABLE_ACTIONS.CREATE}
						open={openDeliverableCategoryDialog}
						handleClose={() => setOpenDeliverableCategoryDialog(false)}
						organization={dashboardData?.organization?.id}
					/>
				)}
				{openDeliverableUnitDialog && (
					<DeliverableUnit
						type={DELIVERABLE_ACTIONS.CREATE}
						open={openDeliverableUnitDialog}
						handleClose={() => setOpenDeliverableUnitDialog(false)}
						organization={dashboardData?.organization?.id}
					/>
				)}
			</FormDialog>
			{createSubTargetLoading ? <FullScreenLoader /> : null}
			{updateSubTargetLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default SubTarget;
