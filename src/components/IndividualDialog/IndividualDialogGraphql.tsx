import React, { useEffect } from "react";
import IndividualDialogContainer from "./IndividualDialogContainer";
import { useMutation, useLazyQuery } from "@apollo/client";
import {
	CREATE_INDIVIDUAL,
	CREATE_INDIVIDUAL_PROJECT,
	UPDATE_INDIVIDUAL,
	DELETE_INDIVIDUAL_PROJECT,
} from "../../graphql/Individual/mutation";
import {
	ICreateIndividual,
	ICreateIndividualVariables,
	ICreateIndividualProject,
	ICreateIndividualProjectVariables,
	IUpdateIndividual,
	IUpdateIndividualVariables,
	IDeleteIndividualProject,
	IDeleteIndividualProjectVariables,
} from "../../models/individual/query";
import { IGetProject } from "../../models/project/project";
import { GET_PROJECTS } from "../../graphql";
import { FORM_ACTIONS } from "../../models/constants";
import { IIndividual } from "../../models/individual";
import { IndividualDialogType } from "../../models/individual/constant";

type IAddressFormGraphqlProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			dialogType?: IndividualDialogType;
			deleteIndividual?: boolean;
	  }
	| {
			open: boolean;
			dialogType?: IndividualDialogType;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IIndividual;
			deleteIndividual?: boolean;
	  };

function IndividualDialogGraphql(props: IAddressFormGraphqlProps) {
	const { handleClose, open, dialogType = IndividualDialogType.organization } = props;
	const [createIndividual, { loading: creatingIndividual }] = useMutation<
		ICreateIndividual,
		ICreateIndividualVariables
	>(CREATE_INDIVIDUAL);

	const [updateIndividual, { loading: updatingIndividual }] = useMutation<
		IUpdateIndividual,
		IUpdateIndividualVariables
	>(UPDATE_INDIVIDUAL);

	const [createIndividualProject, { loading: creatingIndividualProject }] = useMutation<
		ICreateIndividualProject,
		ICreateIndividualProjectVariables
	>(CREATE_INDIVIDUAL_PROJECT);

	const [deleteIndividualProject, { loading: updatingIndividualProject }] = useMutation<
		IDeleteIndividualProject,
		IDeleteIndividualProjectVariables
	>(DELETE_INDIVIDUAL_PROJECT);

	const [getProjects, { data: projects }] = useLazyQuery<IGetProject>(GET_PROJECTS);

	useEffect(() => {
		getProjects();
	}, [getProjects]);

	return (
		<IndividualDialogContainer
			createIndividual={createIndividual}
			loading={
				creatingIndividual ||
				creatingIndividualProject ||
				updatingIndividualProject ||
				updatingIndividual
			}
			open={open}
			handleClose={handleClose}
			{...(props.formAction == FORM_ACTIONS.UPDATE
				? {
						initialValues: props.initialValues,
						formAction: FORM_ACTIONS.UPDATE,
				  }
				: { formAction: FORM_ACTIONS.CREATE })}
			projects={projects?.orgProject || []}
			createIndividualProject={createIndividualProject}
			updateIndividual={updateIndividual}
			deleteIndividualProject={deleteIndividualProject}
			dialogType={dialogType}
			deleteIndividual={props.deleteIndividual}
		/>
	);
}

export default IndividualDialogGraphql;
