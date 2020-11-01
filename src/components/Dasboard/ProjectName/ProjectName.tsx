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
		marginLeft: theme.spacing(1),
		margin: theme.spacing(2),
		marginBottom: theme.spacing(1),
		"& :hover": {
			"& $EditIcon": {
				opacity: 1,
			},
		},
	},
}));

function ProjectEditButton({
	project,
	workspaces,
	refetch,
}: {
	project: {
		id: number;
		name: string;
		short_name: string;
		description: string;
		workspace: IOrganisationWorkspaces;
		attachments: AttachFile[];
	};
	workspaces: IOrganisationWorkspaces[];
	refetch:
		| ((
				variables?: Partial<Record<string, any>> | undefined
		  ) => Promise<ApolloQueryResult<any>>)
		| undefined;
}) {
	const classes = useStyles();
	const { data: projDonors } = useQuery(GET_PROJ_DONORS, {
		variables: { filter: { project: project.id } },
	});
	const [projectDetails, setProjectDetails] = useState<any>();

	const [openUpdateForm, setOpenUpdateForm] = useState<boolean>(false);
	useEffect(() => {
		if (projDonors) {
			let donorIds = projDonors?.projectDonors?.map((donors: any) => donors?.donor?.id);

			setProjectDetails({
				id: project.id,
				name: project.name,
				short_name: project.short_name,
				description: project.description,
				workspace: project.workspace.id,
				donor: donorIds,
				attachments: project.attachments,
			});
		}
	}, [projDonors, project]);
	return (
		<>
			<IconButton
				className={classes.EditIcon}
				aria-controls={`projectMenu${project.id}`}
				aria-haspopup="true"
				onClick={() => setOpenUpdateForm(true)}
			>
				<EditOutlinedIcon fontSize="small" />
			</IconButton>
			{openUpdateForm && projectDetails && (
				<Project
					open={projectDetails !== null}
					handleClose={() => setOpenUpdateForm(false)}
					data={projectDetails}
					workspaces={workspaces}
					workspace={project.workspace.id}
					type={PROJECT_ACTIONS.UPDATE}
					reftechOnSuccess={refetch}
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
		<Box display="flex" className={classes.root}>
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
