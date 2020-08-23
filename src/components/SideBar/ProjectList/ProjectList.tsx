import { useQuery } from "@apollo/client";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { useDashBoardData, useDashboardDispatch } from "../../../contexts/dashboardContext";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/queries";
import { setProject } from "../../../reducers/dashboardReducer";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		selectedProject: {
			backgroundColor: theme.palette.grey[100],
		},
		listItem: {
			backgroundColor: "#e0e0e0",
		},
	})
);

export default function ProjectList({
	workspaceId,
	projectIndex,
}: {
	workspaceId: any;
	projectIndex: number;
}) {
	const classes = useStyles();
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	const filter: any = { variables: { filter: { workspace: workspaceId } } };
	const { data } = useQuery(GET_PROJECTS_BY_WORKSPACE, filter);
	React.useEffect(() => {
		if (data && projectIndex === 0) {
			dispatch(setProject(data.orgProject[0]));
		}
	}, [data, dispatch, projectIndex]);
	return (
		<List>
			{data &&
				data.orgProject &&
				data.orgProject.map((project: { id: number; name: string }) => (
					<ListItem
						className={
							dashboardData?.project?.id === project.id ? classes.selectedProject : ""
						}
						button
						key={project.id}
						onClick={() => {
							dispatch(setProject(project));
						}}
					>
						<ListItemText primary={project.name} />
					</ListItem>
				))}
		</List>
	);
}
