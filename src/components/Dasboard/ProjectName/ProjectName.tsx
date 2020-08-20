import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PROJECT_BY_ID, UPDATE_PROJECT } from "../../../graphql/queries/project";
import { IProject } from "../../../models/project/project";
import EditableText from "../../EditableText/EditableText";
import { useDashBoardData } from "../../../contexts/dashboardContext";
const useStyles = makeStyles((theme: Theme) => ({
	root: {
		margin: theme.spacing(1),
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
	const dashboardData = useDashBoardData();
	const [project, setProject] = useState<IProject>({
		name: "",
	});
	const [getProject, { data, loading }] = useLazyQuery(GET_PROJECT_BY_ID);

	useEffect(() => {
		if (dashboardData?.project) {
			getProject({ variables: { id: dashboardData?.project.id } });
		}
	}, [dashboardData?.project]);

	const [updateProject] = useMutation(UPDATE_PROJECT);

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
		await updateProject({
			variables: { id: dashboardData?.project?.id, input: { ...project, name: value } },
		});
		getProject({ variables: { id: dashboardData?.project?.id } });
	};
	return (
		<Box>
			{loading ? <CircularProgress /> : null}
			{project && project.name && (
				<EditableText textValue={project.name} handleSubmit={handleSubmit} />
			)}
		</Box>
	);
}
