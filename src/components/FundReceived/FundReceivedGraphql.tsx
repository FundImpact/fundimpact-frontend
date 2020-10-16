import React, { useEffect } from "react";
import FundReceivedContainer from "./FundReceivedContainer";
import { FORM_ACTIONS } from "../Forms/constant";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PROJECT_DONORS } from "../../graphql";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { CREATE_FUND_RECEIPT, UPDATE_FUND_RECEIPT } from "../../graphql/FundRecevied/mutation";
import { IFundReceivedForm, IFundReceivedProps } from "../../models/fundReceived";
import { getTodaysDate } from "../../utils";
import { ICreateFundReceipt, ICreateFundReceiptVariables, IUpdateFundReceiptVariables, IUpdateFundReceipt } from "../../models/fundReceived/query";

const getDonors = (projectDonors: { id: string; donor: { id: string; name: string } }[]) =>
	projectDonors.map((projectDonor) => ({
		id: projectDonor?.id,
		name: projectDonor?.donor?.name,
	}));

const defaultFormValues: IFundReceivedForm = {
	amount: "",
	project_donor: "",
	reporting_date: getTodaysDate(),
};

const getInitialFormValues = ({
	formAction,
	initialValues,
}: {
	formAction: FORM_ACTIONS;
	initialValues?: IFundReceivedForm;
}): IFundReceivedForm => {
	if (formAction == FORM_ACTIONS.UPDATE && initialValues) {
		return initialValues;
	}
	return defaultFormValues;
};

function FundReceivedGraphql({ formAction, open, handleClose, initialValues }: IFundReceivedProps) {
	const [getProjectDonors, { data: donorList }] = useLazyQuery(GET_PROJECT_DONORS);
	const [createFundReceipt, { loading: creatingFundReceipt }] = useMutation<
		ICreateFundReceipt,
		ICreateFundReceiptVariables
	>(CREATE_FUND_RECEIPT);
	const [updateFundReceipt, { loading: updatingFundReceipt }] = useMutation<
		IUpdateFundReceipt,
		IUpdateFundReceiptVariables
	>(UPDATE_FUND_RECEIPT);

	const dashboardData = useDashBoardData();

	const initialFormValues = getInitialFormValues({ formAction, initialValues });

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
			donorList={(donorList?.projDonors && getDonors(donorList?.projDonors)) || []}
			formAction={formAction}
			open={open}
			handleClose={handleClose}
			loading={creatingFundReceipt || updatingFundReceipt}
			createFundReceipt={createFundReceipt}
			initialValues={initialFormValues}
			updateFundReceipt={updateFundReceipt}
		/>
	);
}

export default FundReceivedGraphql;
