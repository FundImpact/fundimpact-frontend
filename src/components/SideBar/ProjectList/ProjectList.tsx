import React from "react";
import { ListItem, ListItemText, List } from "@material-ui/core";
import { GET_PROJECTS_BY_WORKSPACE } from "../../../graphql/queries/index";
import { useQuery } from "@apollo/client";

export default function ProjectList({ workspaceId }: { workspaceId: any }) {
	const filter: any = { variables: { filter: { workspace: workspaceId } } };
	const { data, loading, error } = useQuery(GET_PROJECTS_BY_WORKSPACE, filter);
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
