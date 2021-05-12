import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { FORM_ACTIONS } from "../constant";
import CommonForm from "../../CommonForm/commonForm";
import { userRoleForm } from "./inputField.json";
import { UserRoleProps, IUserRole, IUserRoleUpdate } from "../../../models/UserRole/UserRole";
import { useIntl } from "react-intl";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	GET_INVITED_USER_LIST,
	GET_INVITED_USER_LIST_COUNT,
	GET_ROLES,
} from "../../../graphql/UserRoles/query";
import {
	useLazyQuery,
	useMutation,
	useQuery,
	MutationFunctionOptions,
	FetchResult,
	useApolloClient,
	ApolloClient,
} from "@apollo/client";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	INVITE_USER,
	ASSIGN_PROJECT_TO_USER,
	UNASSIGN_PROJECTS_ASSIGNED_TO_USER,
} from "../../../graphql/UserRoles/mutation";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import FormDialog from "../../FormDialog";
import { GET_PROJECTS } from "../../../graphql";
import { IGetProject } from "../../../models/project/project";
import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { Box, Grid, Typography } from "@material-ui/core";
import { IGetUserRole } from "../../../models/access/query";
import { RESTRICTED_ROLES } from "../../../models/User/constant";

const data = `Lorem ipsum dolor sit amet consectetur adipisicing elit.
Earum repellat nisi, officiis incidunt repudiandae
<h1>dqwdqwdqwdqwdqwd</h1>
corporis magnam explicabo, iusto quibusdam similique,
laboriosam commodi dolor sunt odit non cupiditate?
Quasi, explicabo? Nulla.`;

interface IUserRoleError extends Partial<Omit<IUserRole, "project">> {
	project?: string;
}

interface IUserProject {
	id: string;
	project: {
		id: string;
		name: string;
		workspace: {
			id: string;
			name: string;
		};
	};
}

interface IAssignSelectedProjectToUserProps {
	userId: string | number;
	selectedProjects: string[];
	assignProjectToUser: (
		options?:
			| MutationFunctionOptions<
					{
						createOrgUserProject: IUserProject;
					},
					{
						input: {
							user: string | number;
							project: string;
						};
					}
			  >
			| undefined
	) => Promise<
		FetchResult<
			{
				createOrgUserProject: IUserProject;
			},
			Record<any, any>,
			Record<any, any>
		>
	>;
	apolloClient?: ApolloClient<object>;
}

interface IUnAssignSelectedProjectToUserProps {
	userId: string | number;
	selectedProjects: { id: string; user_project_id: string }[];
	unAssignProjectAssignedToUser: (
		options?:
			| MutationFunctionOptions<
					{
						deleteOrgUserProject: IUserProject;
					},
					{
						id: React.ReactText;
						input: {
							user: React.ReactText;
							project: string;
						};
					}
			  >
			| undefined
	) => Promise<
		FetchResult<
			{
				deleteOrgUserProject: IUserProject;
			},
			Record<any, any>,
			Record<any, any>
		>
	>;
}

const Accordion = withStyles({
	root: {
		border: "1px solid rgba(0, 0, 0, .125)",
		boxShadow: "none",
		"&:not(:last-child)": {
			borderBottom: 0,
		},
		"&:before": {
			display: "none",
		},
		"&$expanded": {
			margin: "auto",
		},
	},
	expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
	root: {
		backgroundColor: "rgba(0, 0, 0, .03)",
		borderBottom: "1px solid rgba(0, 0, 0, .125)",
		marginBottom: -1,
		minHeight: 56,
		"&$expanded": {
			minHeight: 56,
		},
	},
	content: {
		"&$expanded": {
			margin: "12px 0",
		},
	},
	expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
	root: {
		padding: theme.spacing(2),
	},
}))(MuiAccordionDetails);

function getInitialValues(
	props: UserRoleProps
): UserRoleProps["type"] extends FORM_ACTIONS.CREATE ? IUserRole : IUserRoleUpdate {
	if (props.type === FORM_ACTIONS.UPDATE) {
		return { ...props.data };
	}
	return {
		email: "",
		role: "",
		project: [],
	};
}

const getSelectedRole = ({
	roleId,
	userRoles,
}: {
	roleId: string;
	userRoles: {
		id: string;
		name: string;
		is_project_level: boolean;
	}[];
}) => userRoles.find((role) => role.id === roleId);

const hideRoleAndEmailFieldAndShowProjects = () => {
	userRoleForm[0].hidden = true;
	userRoleForm[1].hidden = true;
	userRoleForm[2].hidden = false;
};

const getProjectGroupHeadingInUserRoleForm = (project: IGetProject["orgProject"][0]) =>
	project.workspace.name;

const sortProjectsToGroupProject = (projects: IGetProject["orgProject"]) =>
	projects.sort((project1, project2) => +project1.workspace.id - +project2.workspace.id);

const filterRoles = (
	roles: { type: string; id: string; name: string; description: string; sequence: number }[]
) =>
	roles
		.filter((role) => role.sequence)
		.sort((roleOne, roleTwo) => roleOne.sequence - roleTwo.sequence);

const getInvitedUserCountCachedValue = (apolloClient: ApolloClient<object>) => {
	let count = 0;
	try {
		let cachedCount = apolloClient.readQuery({
			query: GET_INVITED_USER_LIST_COUNT,
			variables: {
				filter: {},
			},
		});
		count = cachedCount?.userListCount;
	} catch (err) {
		console.error(err);
	}
	return count;
};

const submitForm = async ({
	sendInvitationToUser,
	submittedValues,
}: {
	submittedValues: { email: string; role: string };
	sendInvitationToUser: (
		options?: MutationFunctionOptions<any, Record<string, any>> | undefined
	) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
}) => {
	const sendInvitationToUserResponse = await sendInvitationToUser({
		variables: {
			input: {
				email: submittedValues.email,
				role: submittedValues.role,
				redirectTo: `${window.location.protocol}//${window.location.host}/account/profile`,
			},
		},
	});
	return sendInvitationToUserResponse;
};

const refetchUsers = async ({ apolloClient }: { apolloClient: ApolloClient<object> }) => {
	try {
		const limit = getInvitedUserCountCachedValue(apolloClient);

		await apolloClient.query({
			query: GET_INVITED_USER_LIST,
			variables: {
				filter: {},
				limit: limit > 10 ? 10 : limit,
				start: 0,
				sort: "created_at:DESC",
			},
			fetchPolicy: "network-only",
		});
		await apolloClient.query({
			query: GET_INVITED_USER_LIST_COUNT,
			variables: {
				filter: {},
			},
			fetchPolicy: "network-only",
		});
	} catch (err) {
		console.error(err);
	}
};

const assignSelectedProjectToUser = async ({
	userId,
	selectedProjects,
	assignProjectToUser,
}: IAssignSelectedProjectToUserProps) => {
	for (let i = 0; i < selectedProjects.length; i++) {
		try {
			await assignProjectToUser({
				variables: {
					input: {
						user: userId,
						project: selectedProjects[i],
					},
				},
			});
		} catch (err) {
			console.error(err);
		}
	}
};

const unassignSelectedProjectToUser = async ({
	userId,
	selectedProjects,
	unAssignProjectAssignedToUser,
}: IUnAssignSelectedProjectToUserProps) => {
	for (let i = 0; i < selectedProjects.length; i++) {
		try {
			await unAssignProjectAssignedToUser({
				variables: {
					id: selectedProjects[i].user_project_id,
					input: {
						user: userId,
						project: selectedProjects[i].id,
					},
				},
			});
		} catch (err) {
			console.error(err);
		}
	}
};

const getNewAssignedProjectToUser = ({
	initialProjects,
	newProjectsSubmitted,
}: {
	initialProjects: IUserRoleUpdate["project"];
	newProjectsSubmitted: IUserRoleUpdate["project"];
}) => {
	const initialProjectIdHash = initialProjects.reduce(
		(projectIdHash: { [key: string]: string }, currentProject) => {
			projectIdHash[currentProject.id] = "1";
			return projectIdHash;
		},
		{}
	);
	return newProjectsSubmitted.filter((project) => !(project.id in initialProjectIdHash));
};

const getUnassignedProjectsToUser = ({
	initialProjects,
	newProjectsSubmitted,
}: {
	initialProjects: IUserRoleUpdate["project"];
	newProjectsSubmitted: IUserRoleUpdate["project"];
}) => {
	const newProjectIdHash = newProjectsSubmitted.reduce(
		(projectIdHash: { [key: string]: string }, currentProject) => {
			projectIdHash[currentProject.id] = "1";
			return projectIdHash;
		},
		{}
	);
	return initialProjects.filter((project) => !(project.id in newProjectIdHash));
};

function UserRoleForm(props: UserRoleProps) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues = getInitialValues(props);
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const { handleClose } = props;
	const apolloClient = useApolloClient();
	const onCancel = useCallback(() => {
		userRoleForm[2].hidden = true;
		userRoleForm[0].hidden = false;
		userRoleForm[1].hidden = false;
		handleClose();
	}, [handleClose]);

	const [sendInvitationToUser, { loading: sendInvitationToUserLoading }] = useMutation(
		INVITE_USER,
		{
			onCompleted(data) {
				notificationDispatch(setSuccessNotification("Invitation Sent"));
				onCancel();
			},
			onError(err) {
				notificationDispatch(setErrorNotification(err.message));
			},
		}
	);

	const [assignProjectToUser, { loading: assigningProjectToUser }] = useMutation<
		{ createOrgUserProject: IUserProject },
		{ input: { user: string | number; project: string } }
	>(ASSIGN_PROJECT_TO_USER);

	const [unAssignProjectAssignedToUser, { loading: unassigningProjectToUser }] = useMutation<
		{ deleteOrgUserProject: IUserProject },
		{ id: string | number; input: { user: string | number; project: string } }
	>(UNASSIGN_PROJECTS_ASSIGNED_TO_USER);

	const [selectedRole, setSelectedRole] = useState<{
		id: string;
		name: string;
		is_project_level: boolean;
	} | null>();

	const [getProjects, { data: projects }] = useLazyQuery<IGetProject>(GET_PROJECTS);

	useEffect(() => {
		getProjects();
	}, [getProjects]);

	(userRoleForm[2].optionsArray as IGetProject["orgProject"]) = useMemo(
		() => sortProjectsToGroupProject(projects?.orgProject.slice() || []),
		[projects]
	);

	if (props.type == FORM_ACTIONS.UPDATE) {
		hideRoleAndEmailFieldAndShowProjects();
	}

	(userRoleForm[2].autoCompleteGroupBy as unknown) = getProjectGroupHeadingInUserRoleForm;

	const { data: userRoles } = useQuery(GET_ROLES, {
		// variables: { organization: dashboardData?.organization?.id },
		onError(err) {
			console.log("role", err);
		},
	});

	const intl = useIntl();
	let title = intl.formatMessage({
		id: "addUserRoleFormTitle",
		defaultMessage: "Add Role to a User",
		description: "This text will be show on user update form for title",
	});
	let subtitle = intl.formatMessage({
		id: "addUserRoleFormSubTitleTitle",
		defaultMessage: "give user a role",
		description: "This text will be show on user update form for subtitle",
	});
	(userRoleForm[1].optionsArray as {
		type: string;
		id: string;
		name: string;
	}[]) = useMemo(() => filterRoles(userRoles?.roles || []), [userRoles, dashboardData]);

	useEffect(() => {
		if (props.type == FORM_ACTIONS.UPDATE) {
			setSelectedRole(
				getSelectedRole({
					roleId: props.data.role,
					userRoles: userRoles?.roles || [],
				})
			);
		}
	}, [userRoles]);

	userRoleForm[1].getInputValue = useCallback(
		(roleId: string) => {
			let selectedUserRole = getSelectedRole({
				roleId,
				userRoles: userRoles?.roles || [],
			});

			if (selectedUserRole?.is_project_level) {
				userRoleForm[2].hidden = false;
			} else {
				userRoleForm[2].hidden = true;
			}
			setSelectedRole(selectedUserRole);
		},
		[setSelectedRole, userRoles]
	);

	const onCreate = async (value: IUserRole) => {
		try {
			let selectedProjects = value.project;
			delete value.project;
			let sendInvitationToUserResponse = await submitForm({
				sendInvitationToUser,
				submittedValues: value,
			});
			await assignSelectedProjectToUser({
				userId: sendInvitationToUserResponse?.data?.inviteUser?.id || "",
				selectedProjects: selectedProjects?.map(({ id }) => id) || [],
				assignProjectToUser,
			});
			await refetchUsers({ apolloClient });
		} catch (err) {
			console.error(err);
		}
	};

	const onUpdate = async (submittedValues: IUserRoleUpdate) => {
		try {
			let newAssignedProjectsToUser = getNewAssignedProjectToUser({
				initialProjects: initialValues.project,
				newProjectsSubmitted: submittedValues.project,
			});
			await assignSelectedProjectToUser({
				userId: submittedValues.id || "",
				selectedProjects:
					newAssignedProjectsToUser?.map(({ id }: { id: string }) => id) || [],
				assignProjectToUser,
			});
			let unssignedProjectsToUser = getUnassignedProjectsToUser({
				initialProjects: initialValues.project,
				newProjectsSubmitted: submittedValues.project,
			});
			await unassignSelectedProjectToUser({
				userId: submittedValues.id || "",
				selectedProjects:
					unssignedProjectsToUser?.map(
						({ id, user_project_id }: { id: string; user_project_id: string }) => ({
							id,
							user_project_id,
						})
					) || [],
				unAssignProjectAssignedToUser,
			});
			await refetchUsers({ apolloClient });
			notificationDispatch(setSuccessNotification("User updated"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	const validate = (values: IUserRole) => {
		let errors: IUserRoleError = {};
		if (!values.role) {
			errors.role = "Role is required";
		}
		if (!values.email) {
			errors.email = "Email is required";
		}
		if (
			selectedRole?.is_project_level &&
			(!values.project || !values.project.length) &&
			props.type !== FORM_ACTIONS.UPDATE
		) {
			errors.project = "Project is required";
		}
		return errors;
	};

	return (
		<React.Fragment>
			<FormDialog
				title={title}
				subtitle={subtitle}
				open={formIsOpen}
				handleClose={onCancel}
				loading={
					assigningProjectToUser ||
					sendInvitationToUserLoading ||
					unassigningProjectToUser
				}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onCreate}
					cancelButtonName="Cancel"
					createButtonName="Add"
					formAction={formAction}
					onUpdate={onUpdate}
					inputFields={userRoleForm}
					onCancel={onCancel}
				>
					<Box maxHeight="300px" overflow="auto">
						{filterRoles(userRoles?.roles || [])?.map(
							(role: {
								id: string;
								name: string;
								type: string;
								description: string;
							}) => (
								<Accordion id={role?.id} square>
									<AccordionSummary
										aria-controls="panel1d-content"
										id="panel1d-header"
									>
										<Typography>{role?.name}</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Typography
											dangerouslySetInnerHTML={{ __html: role?.description }}
										/>
									</AccordionDetails>
								</Accordion>
							)
						)}
					</Box>
				</CommonForm>
			</FormDialog>
		</React.Fragment>
	);
}

export default UserRoleForm;
