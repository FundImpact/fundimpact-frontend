import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PROJECT_BY_ID, UPDATE_PROJECT } from "../../../graphql/project";
import { IProject } from "../../../models/project/project";
import EditableText from "../../EditableText/EditableText";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { PROJECT_ACTIONS } from "../../../utils/access/modules/project/actions";

export default function ProjectName() {
	const dashboardData = useDashBoardData();
	const [project, setProject] = useState<IProject>({
		name: "",
	});
	const [getProject, { data, loading }] = useLazyQuery(GET_PROJECT_BY_ID);

	useEffect(() => {
		if (dashboardData?.project) {
			getProject({ variables: { id: dashboardData?.project.id } });
		}
	}, [dashboardData, getProject]);

	const [updateProject] = useMutation(UPDATE_PROJECT);

	useEffect(() => {
		if (data) {
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

	const projectEditAccess = userHasAccess(MODULE_CODES.PEOJECT, PROJECT_ACTIONS.UPDATE_PROJECT);

	return (
		<Box display="flex">
			{loading ? (
				<Box m={2} mr={0}>
					<CircularProgress size={40} />
				</Box>
			) : null}
			{project && project.name && (
				<EditableText
					textValue={project.name}
					handleSubmit={handleSubmit}
					showEditIcon={projectEditAccess}
				/>
			)}
		</Box>
	);
}
