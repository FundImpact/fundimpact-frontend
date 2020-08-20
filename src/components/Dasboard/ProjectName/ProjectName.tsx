import React, { useState, useEffect } from "react";
import { Box } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PROJECT_BY_ID, UPDATE_PROJECT } from "../../../graphql/queries/project/project";
import { IProject } from "../../../models/project/project";
import EditableText from "../../EditableText/EditableText";
const useStyles = makeStyles((theme: Theme) => ({
	root: {
		margin: theme.spacing(2),
		marginLeft: theme.spacing(1),
		"& :hover": {
			"& $projectEditIcon": {
				opacity: 1,
			},
		},
	},
	project: {
		padding: theme.spacing(1),
	},
	projectEditIcon: {
		opacity: 0,
	},
}));

export default function ProjectName() {
	const classes = useStyles();
	const [project, setProject] = useState<IProject>({
		name: "",
	});

	const [getProject, { data }] = useLazyQuery(GET_PROJECT_BY_ID, {
		variables: { id: 1 },
	});

	const [updateProject] = useMutation(UPDATE_PROJECT);

	useEffect(() => {
		getProject();
	}, []);

	useEffect(() => {
		if (data && data.project) {
			setProject({
				name: data.project.name,
				short_name: data.project.short_name,
				description: data.project.description,
			});
		}
	}, [data]);

	const handleSubmit = async (value: string) => {
		await updateProject({ variables: { id: 1, input: { ...project, name: value } } });
		getProject();
	};
	return (
		<Box>
			{project && project.name && (
				<EditableText textValue={project.name} handleSubmit={handleSubmit} />
			)}
		</Box>
	);
}
