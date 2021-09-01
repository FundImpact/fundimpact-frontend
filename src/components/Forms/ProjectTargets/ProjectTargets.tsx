import React, { useEffect, useState } from "react";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import CommonForm from "../../CommonForm/commonForm";
import { projectTargetsForm } from "./inputField.json";
import { useQuery } from "@apollo/client";
import {
	setSuccessNotification,
	setErrorNotification,
} from "../../../reducers/notificationReducer";
import { useIntl } from "react-intl";
import FormDialog from "../../FormDialog";
import { IProjectTargets, ProjectTargetsProps } from "../../../models/projectTargets";
import { GET_DELIVERABLE_TARGET_BY_PROJECT } from "../../../graphql/Deliverable/target";
import { GET_IMPACT_TARGET_BY_PROJECT } from "../../../graphql/Impact/target";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/Budget";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";
import { usePostFetch } from "../../../hooks/fetch/usePostFetch";
import { MANAGE_PROJECT_TARGETS } from "../../../utils/endpoints.util";
import { useRefetchOnBudgetTargetImport } from "../../../hooks/budget";
import { useRefetchOnDeliverableTargetImport } from "../../../hooks/deliverable";

function ProjectTargets(props: ProjectTargetsProps) {
	const notificationDispatch = useNotificationDispatch();
	const [initialValues, setinitialValues] = useState<IProjectTargets>({
		projects: [],
		target: "",
	});
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = () => {
		props?.handleClose();
		setinitialValues({
			projects: [],
			target: "",
		});
	};
	const { formType } = props;
	const dashboardData = useDashBoardData();
	const filter: any = {
		variables: {
			filter: {
				workspace: {
					organization: dashboardData?.organization?.id,
				},
			},
		},
	};
	const [initiateRequest, setInitiateRequest] = useState(false);
	let { refetchOnBudgetTargetImport } = useRefetchOnBudgetTargetImport();
	let { refetchOnDeliverableTargetImport } = useRefetchOnDeliverableTargetImport();
	let { data, loading, error: apiError, setPayload } = usePostFetch<any>({
		url: MANAGE_PROJECT_TARGETS,
		body: null,
		initiateRequest,
	});

	useEffect(() => {
		if (data) {
			notificationDispatch(setSuccessNotification("Projects Updated successfully !"));
			if (formType === "budget") refetchOnBudgetTargetImport();
			if (formType === "deliverable") refetchOnDeliverableTargetImport();
			onCancel();
		}
	}, [data]);

	useEffect(() => {
		if (apiError) {
			notificationDispatch(setErrorNotification(apiError));
		}
	}, [apiError]);

	const { data: orgProject } = useQuery(GET_PROJECTS_BY_WORKSPACE, filter);

	const { data: deliverableTargets } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: {
			filter: {
				project_with_deliverable_targets: {
					project: dashboardData?.project?.id,
				},
			},
		},
		skip: formType != "deliverable",
	});

	const { data: impactTargets } = useQuery(GET_IMPACT_TARGET_BY_PROJECT, {
		variables: {
			filter: {
				project_with_impact_targets: {
					project: dashboardData?.project?.id,
				},
			},
		},
		skip: formType != "impact",
	});

	const { data: budgetTargets } = useQuery(GET_BUDGET_TARGET_PROJECT, {
		variables: {
			filter: {
				project_with_budget_targets: {
					project: dashboardData?.project?.id,
				},
			},
		},
		skip: formType != "budget",
	});

	const getTargetOptions = () =>
		formType === "budget"
			? budgetTargets?.projectBudgetTargets || []
			: formType === "deliverable"
			? deliverableTargets?.deliverableTargetList || []
			: formType === "impact"
			? impactTargets?.impactTargetProjectList || []
			: "";

	projectTargetsForm[0].optionsArray = getTargetOptions();
	projectTargetsForm[1].optionsArray = orgProject?.orgProject || [];

	projectTargetsForm[0].getInputValue = (targetId: string) => {
		let projects = [];
		let currTarget: any = projectTargetsForm[0]?.optionsArray.find(
			(elem: any) => elem.id === targetId
		);
		if (formType === "budget") {
			projects = currTarget?.project_with_budget_targets?.map(
				(elem: { project: { id: string; name: string } }) => elem.project.id
			);
		}
		if (formType === "deliverable") {
			projects = currTarget?.project_with_deliverable_targets?.map(
				(elem: { project: { id: string; name: string } }) => elem.project.id
			);
		}
		if (formType === "impact") {
			projects = currTarget?.project_with_impact_targets?.map(
				(elem: { project: { id: string; name: string } }) => elem.project.id
			);
		}
		setinitialValues({
			projects,
			target: currTarget.id,
		});
	};
	const onUpdate = (value: IProjectTargets) => {
		setPayload({
			formType,
			...value,
		});
		setInitiateRequest(true);
	};

	const validate = (values: IProjectTargets) => {
		let errors: Partial<IProjectTargets> = {};
		if (!values.target) {
			errors.target = "Target is required";
		}

		return errors;
	};
	const intl = useIntl();
	let projectTargetTitle = intl.formatMessage({
		id: "projectTargetsFormTitle",
		defaultMessage: "Project Targets",
		description: "This text will be show",
	});
	let projectTargetSubTitle = intl.formatMessage({
		id: "projectTargetsFormSubtitle",
		defaultMessage: "Manage Targets for projects ",
		description: "This text will be show on",
	});

	return (
		<React.Fragment>
			<FormDialog
				title={projectTargetTitle}
				subtitle={projectTargetSubTitle}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate: () => {},
						onCancel,
						formAction,
						onUpdate,
						inputFields: projectTargetsForm,
					}}
				/>
			</FormDialog>
		</React.Fragment>
	);
}

export default ProjectTargets;
