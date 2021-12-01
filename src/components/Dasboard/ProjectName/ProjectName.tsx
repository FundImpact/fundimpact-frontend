import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, IconButton, Theme } from "@material-ui/core";
import { useLazyQuery, ApolloQueryResult, useQuery } from "@apollo/client";
import { GET_PROJECT_BY_ID, GET_PROJ_DONORS } from "../../../graphql/project";
import { IGetProjectById } from "../../../models/project/project";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { makeStyles } from "@material-ui/styles";
import Project from "../../Project/Project";
import { IOrganisationWorkspaces, IGET_WORKSPACES_BY_ORG } from "../../../models/workspace/query";
import { AttachFile } from "../../../models/AttachFile";
import { PROJECT_ACTIONS as PROJECT_USER_ACCESS_ACTIONS } from "../../../utils/access/modules/project/actions";
import { PROJECT_ACTIONS } from "../../Project/constants";
import { GET_WORKSPACES_BY_ORG, GET_PROJECTS_BY_WORKSPACE } from "../../../graphql";

const useStyles = makeStyles((theme: Theme) => ({
	EditIcon: {
		opacity: 0,
	},
	root: {
		// marginLeft: theme.spacing(1),
		// margin: theme.spacing(2),
		// marginBottom: theme.spacing(1),
		"& :hover": {
			"& $EditIcon": {
				opacity: 1,
			},
		},
	},
}));

function ProjectEditButton({
	refetch,
	workspaces,
	project,
}: {
	project: {
		attachments: AttachFile[];
		workspace: IOrganisationWorkspaces;
		description: string;
		short_name: string;
		name: string;
		id: number;
		logframe_tracker: boolean;
	};
	workspaces: IOrganisationWorkspaces[];
	refetch:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| undefined;
}): JSX.Element {
	const { data: projDonors } = useQuery(GET_PROJ_DONORS, {
		variables: { filter: { project: project.id } },
	});
	const classes = useStyles();

	// console.log("project projectName.tsx", project);

	const [openUpdateForm, setOpenUpdateForm] = useState<boolean>(false);
	const [projectDetails, setProjectDetails] = useState<any>();
	useEffect(() => {
		if (projDonors) {
			let donorIds = projDonors?.projectDonors
				?.filter((projectDonor: any) => !projectDonor?.deleted)
				.map((donors: any) => donors?.donor?.id);

			setProjectDetails({
				id: project.id,
				name: project.name,
				short_name: project.short_name,
				description: project.description,
				logframe_tracker: project.logframe_tracker,
				workspace: project.workspace.id,
				donor: donorIds,
				attachments: project.attachments,
			});
		}
	}, [projDonors, project]);
	// console.log("projectDetails projectName", projectDetails);

	return (
		<>
			<IconButton
				onClick={() => setOpenUpdateForm(true)}
				aria-haspopup="true"
				aria-controls={`projectMenu${project.id}`}
				className={classes.EditIcon}
			>
				<EditOutlinedIcon fontSize="small" />
			</IconButton>
			{openUpdateForm && projectDetails && (
				<Project
					reftechOnSuccess={refetch}
					data={projectDetails}
					handleClose={() => setOpenUpdateForm(false)}
					workspaces={workspaces}
					workspace={project.workspace.id}
					type={PROJECT_ACTIONS.UPDATE}
					open={projectDetails !== null}
				/>
			)}
		</>
	);
}

export default function ProjectName() {
	const dashboardData = useDashBoardData();
	const classes = useStyles();
	const [getProject, { data: fetchedProject, loading }] = useLazyQuery<IGetProjectById>(
		GET_PROJECT_BY_ID
	);

	const [getProjectsByWorkspace, { data: projectList, refetch }] = useLazyQuery(
		GET_PROJECTS_BY_WORKSPACE
	);

	const [getWorkspaceList, { data: workspaceList }] = useLazyQuery<IGET_WORKSPACES_BY_ORG>(
		GET_WORKSPACES_BY_ORG
	);
	useEffect(() => {
		if (fetchedProject) {
			getProjectsByWorkspace({
				variables: {
					filter: {
						workspace: fetchedProject?.project?.workspace?.id,
						deleted: false,
					},
				},
			});
		}
	}, [fetchedProject]);

	useEffect(() => {
		if (dashboardData?.project) {
			getProject({ variables: { id: dashboardData?.project.id } });
		}
	}, [dashboardData, getProject]);

	// console.log("dashboardData project", dashboardData);

	useEffect(() => {
		if (dashboardData) {
			getWorkspaceList({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);

	const projectEditAccess = userHasAccess(
		MODULE_CODES.PEOJECT,
		PROJECT_USER_ACCESS_ACTIONS.UPDATE_PROJECT
	);
	return (
		<Box display="flex" className={classes.root} m={2} ml={1} mb={1}>
			{loading ? (
				<Box m={2} mr={0}>
					<CircularProgress size={40} />
				</Box>
			) : null}

			{fetchedProject && fetchedProject.project?.name && (
				<Box display="flex">
					{
						<Box p={1}>
							<Typography variant="h5">{fetchedProject.project.name}</Typography>
						</Box>
					}
					{projectEditAccess && refetch && projectList && (
						<Box>
							<ProjectEditButton
								project={fetchedProject.project}
								refetch={refetch}
								workspaces={workspaceList?.orgWorkspaces || []}
							/>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
