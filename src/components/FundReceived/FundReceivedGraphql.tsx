import React, { useEffect } from "react";
import FundReceivedContainer from "./FundReceivedContainer";
import { FORM_ACTIONS } from "../Forms/constant";
import { useLazyQuery, useMutation, useApolloClient, ApolloClient } from "@apollo/client";
import { GET_PROJECT_DONORS } from "../../graphql";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { CREATE_FUND_RECEIPT, UPDATE_FUND_RECEIPT } from "../../graphql/FundRecevied/mutation";
import { IFundReceivedForm, IFundReceivedProps } from "../../models/fundReceived";
import { getTodaysDate } from "../../utils";
import {
	ICreateFundReceipt,
	ICreateFundReceiptVariables,
	IUpdateFundReceiptVariables,
	IUpdateFundReceipt,
} from "../../models/fundReceived/query";
import { GET_PROJ_DONORS } from "../../graphql/project";
import {
	IGetProjectDonor,
	ICreateProjectDonorVariables,
	ICreateProjectDonor,
} from "../../models/project/project";
import { IGET_DONOR } from "../../models/donor/query";
import { GET_ORG_DONOR } from "../../graphql/donor";
import { CREATE_PROJECT_DONOR } from "../../graphql/donor/mutation";

const getInitialFormValues = ({
	formAction,
	initialValues,
	projectDonors,
}: {
	formAction: FORM_ACTIONS;
	initialValues?: IFundReceivedForm;
	projectDonors: IGetProjectDonor["projectDonors"];
}): IFundReceivedForm => {
	if (formAction == FORM_ACTIONS.UPDATE && initialValues) {
		return initialValues;
	}
	return {
		amount: "",
		project_donor: projectDonors.length === 1 ? projectDonors[0].id : "",
		reporting_date: getTodaysDate(),
	};
};

const updateProjectDonorCache = ({
	apolloClient,
	projecttDonorCreated,
}: {
	apolloClient: ApolloClient<object>;
	projecttDonorCreated: ICreateProjectDonor;
}) => {
	try {
		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
			query: GET_PROJ_DONORS,
			variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
		});
		if (cachedProjectDonors) {
			apolloClient.writeQuery<IGetProjectDonor>({
				query: GET_PROJ_DONORS,
				variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
				data: {
					projectDonors: [
						projecttDonorCreated.createProjDonor,
						...cachedProjectDonors.projectDonors,
					],
				},
			});
		}
	} catch (err) {
		console.error(err);
	}
};

function FundReceivedGraphql({ formAction, open, handleClose, initialValues }: IFundReceivedProps) {
	const [getProjectDonors, { data: donorList }] = useLazyQuery(GET_PROJ_DONORS);
	const [createFundReceipt, { loading: creatingFundReceipt }] = useMutation<
		ICreateFundReceipt,
		ICreateFundReceiptVariables
	>(CREATE_FUND_RECEIPT);
	const [updateFundReceipt, { loading: updatingFundReceipt }] = useMutation<
		IUpdateFundReceipt,
		IUpdateFundReceiptVariables
	>(UPDATE_FUND_RECEIPT);
	let [getOrganizationDonors, { data: orgDonors }] = useLazyQuery<IGET_DONOR>(GET_ORG_DONOR);
	const apolloClient = useApolloClient();
	const [createProjectDonor, { loading: creatingProjectDonors }] = useMutation<
		ICreateProjectDonor,
		ICreateProjectDonorVariables
	>(CREATE_PROJECT_DONOR, {
		onCompleted: (data) => {
			updateProjectDonorCache({ apolloClient, projecttDonorCreated: data });
		},
	});

	const dashboardData = useDashBoardData();
	useEffect(() => {
		getOrganizationDonors({
			variables: {
				filter: {
					organization: dashboardData?.organization?.id,
				},
			},
		});
	}, [getOrganizationDonors]);

	const initialFormValues = getInitialFormValues({
		formAction,
		initialValues,
		projectDonors: donorList?.projectDonors || [],
	});

	useEffect(() => {
		if (dashboardData) {
			getProjectDonors({
				variables: {
					filter: { project: dashboardData?.project?.id },
				},
			});
		}
	}, [dashboardData]);
	return (
		<FundReceivedContainer
			projectDonors={donorList?.projectDonors || []}
			formAction={formAction}
			open={open}
			handleClose={handleClose}
			loading={creatingFundReceipt || updatingFundReceipt || creatingProjectDonors}
			createFundReceipt={createFundReceipt}
			initialValues={initialFormValues}
			updateFundReceipt={updateFundReceipt}
			orgDonors={orgDonors?.orgDonors || []}
			createProjectDonor={createProjectDonor}
		/>
	);
}

export default FundReceivedGraphql;
