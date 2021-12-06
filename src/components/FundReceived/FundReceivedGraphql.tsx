import React, { useEffect } from "react";
import FundReceivedContainer from "./FundReceivedContainer";
import { FORM_ACTIONS } from "../Forms/constant";
import { useLazyQuery, useMutation, useApolloClient, ApolloClient } from "@apollo/client";
// import { GET_PROJECT_DONORS } from "../../graphql";
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
// import { DonorType } from "../../models/fundReceived/conatsnt";

const getInitialFormValues = ({
	formAction,
	initialValues,
	projectDonors,
}: {
	formAction: FORM_ACTIONS;
	initialValues?: IFundReceivedForm;
	projectDonors: IGetProjectDonor["projectDonors"];
}): IFundReceivedForm => {
	if (formAction === FORM_ACTIONS.UPDATE && initialValues) {
		return {
			...initialValues,
			project_donor: initialValues.project_donor,
		};
	}
	return {
		amount: "",
		project_donor: "",
		reporting_date: getTodaysDate(),
		project: "",
		donor: "",
	};
};

const updateProjectDonorCache = ({
	projecttDonorCreated,
	apolloClient,
}: {
	projecttDonorCreated: ICreateProjectDonor;
	apolloClient: ApolloClient<object>;
}) => {
	try {
		let cachedProjectDonors = apolloClient.readQuery<IGetProjectDonor>({
			variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
			query: GET_PROJ_DONORS,
		});
		if (cachedProjectDonors) {
			apolloClient.writeQuery<IGetProjectDonor>({
				variables: { filter: { project: projecttDonorCreated.createProjDonor.project.id } },
				query: GET_PROJ_DONORS,
				data: {
					projectDonors: [
						{ ...projecttDonorCreated?.createProjDonor, deleted: false },
						...cachedProjectDonors.projectDonors,
					],
				},
			});
		}
	} catch (err) {
		console.error(err);
	}
};

function FundReceivedGraphql({
	formAction,
	open,
	handleClose,
	initialValues,
	dialogType,
}: IFundReceivedProps) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dashboardData]);
	console.log("updateFundReceipt::", initialFormValues);
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
			dialogType={dialogType}
		/>
	);
}

export default FundReceivedGraphql;
