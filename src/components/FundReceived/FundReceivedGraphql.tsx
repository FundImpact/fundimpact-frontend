import React, { useEffect } from "react";
import FundReceivedContainer from "./FundReceivedContainer";
import { FORM_ACTIONS } from "../Forms/constant";
import { useLazyQuery } from "@apollo/client";
import { GET_PROJECT_DONORS } from "../../graphql";
import { useDashBoardData } from "../../contexts/dashboardContext";

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
	console.log("donorList?.projDonors?.donor :>> ", donorList?.projDonors);
	return (
		<FundReceivedContainer
			donorList={(donorList?.projDonors && getDonors(donorList?.projDonors)) || []}
			formAction={formAction}
			open={open}
			handleClose={handleClose}
		/>
	);
}

export default FundReceivedGraphql;
