import React, { useEffect } from "react";
import FundReceivedContainer from "./FundReceivedContainer";
import { FORM_ACTIONS } from "../Forms/constant";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PROJECT_DONORS } from "../../graphql";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { CREATE_FUND_RECEIPT } from "../../graphql/FundRecevied/mutation";

const getDonors = (projectDonors: { donor: { id: string; name: string } }[]) =>
	projectDonors.map((projectDonor) => projectDonor?.donor);

function FundReceivedGraphql({
	formAction,
	open,
	handleClose,
}: {
	formAction: FORM_ACTIONS;
	open: boolean;
	handleClose: () => void;
}) {
	const [getProjectDonors, { data: donorList }] = useLazyQuery(GET_PROJECT_DONORS);
	const [createFundReceipt, { loading }] = useMutation(CREATE_FUND_RECEIPT);

	const dashboardData = useDashBoardData();

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
			loading={loading}
			createFundReceipt={createFundReceipt}
		/>
	);
}

export default FundReceivedGraphql;
