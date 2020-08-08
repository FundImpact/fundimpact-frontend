import React from "react";
import { ListItem, ListItemText, List } from "@material-ui/core";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/queries/index";
import { useQuery } from "@apollo/client";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		ProjectList: {
			padding: theme.spacing(0),
		},
	})
);

export default function ProjectList({ workspaceId }: { workspaceId: any }) {
	const classes = useStyles();
	const filter: any = { variables: { filter: { workspace: workspaceId } } };
	const { data } = useQuery(GET_PROJECTS_BY_WORKSPACE, filter);
	React.useEffect(() => {
		if (data) {
			console.log(data);
		}
	}, [data]);
	return (
		<List>
			{data &&
				data.orgProject &&
				data.orgProject.map((project: { id: number; name: string }) => (
					<ListItem button key={project.id}>
						<ListItemText primary={project.name} />
					</ListItem>
				))}
		</List>
	);
}
