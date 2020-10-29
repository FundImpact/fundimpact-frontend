import React, { useEffect } from "react";
import IndividualDialogContainer from "./IndividualDialogContainer";
import { useMutation, useLazyQuery } from "@apollo/client";
import { CREATE_INDIVIDUAL, CREATE_INDIVIDUAL_PROJECT } from "../../graphql/Individual/mutation";
import {
	ICreateIndividual,
	ICreateIndividualVariables,
	ICreateIndividualProject,
	ICreateIndividualProjectVariables,
} from "../../models/individual/query";
import { IGetProject } from "../../models/project/project";
import { GET_PROJECTS } from "../../graphql";

function IndividualDialogGraphql({
	open,
	handleClose,
}: {
	open: boolean;
	handleClose: () => void;
}) {
	const [createIndividual, { loading: creatingIndividual }] = useMutation<
		ICreateIndividual,
		ICreateIndividualVariables
	>(CREATE_INDIVIDUAL);

	const [createIndividualProject, { loading: creatingIndividualProject }] = useMutation<
		ICreateIndividualProject,
		ICreateIndividualProjectVariables
	>(CREATE_INDIVIDUAL_PROJECT);

	const [getProjects, { data: projects }] = useLazyQuery<IGetProject>(GET_PROJECTS);

	useEffect(() => {
		getProjects();
	}, [getProjects]);

	return (
		<IndividualDialogContainer
			createIndividual={createIndividual}
			loading={creatingIndividual || creatingIndividualProject}
			open={open}
			handleClose={handleClose}
			projects={projects?.orgProject || []}
			createIndividualProject={createIndividualProject}
		/>
	);
}

export default IndividualDialogGraphql;
