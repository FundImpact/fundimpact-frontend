import React from "react";
import { ListItem, ListItemText, List } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/queries/index";
import { useQuery } from "@apollo/client";
import { useDashBoardData, useDashboardDispatch } from "../../../contexts/dashboardContext";
import { setProject } from "../../../reducers/dashboardReducer";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		selectedProject: {
			backgroundColor: theme.palette.grey[100],
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
	const dashboardData = useDashBoardData();
	const dispatch = useDashboardDispatch();
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
