import React from "react";
import FormDialog from "../FormDialog";
import { FORM_ACTIONS } from "../../models/constants";
import { useIntl } from "react-intl";
import { useDashBoardData } from "../../contexts/dashboardContext";
import CommonForm from "../CommonForm";
import { IFundReceivedForm } from "../../utils/access/modules/fundReceived";
import { fundReceivedForm } from "./inputFields.json";
import { getTodaysDate } from "../../utils";

const defaultFormValues: IFundReceivedForm = {
	amount: "",
	project_donor_id: "",
	reporting_date: getTodaysDate(),
};

const validate = (values: IFundReceivedForm) => {
	let errors: Partial<IFundReceivedForm> = {};
	if (!values.amount) {
		errors.amount = "Amount is required";
	}
	if (!values.project_donor_id) {
		errors.project_donor_id = "Donor is required";
	}
	if (!values.reporting_date) {
		errors.reporting_date = "Date is required";
	}
	return errors;
};

function FundReceivedContainer({
	formAction,
	open,
	handleClose,
	donorList,
}: {
	formAction: FORM_ACTIONS;
	open: boolean;
	handleClose: () => void;
	donorList: { id: string; name: string }[];
}) {
	const dashboardData = useDashBoardData();
	const intl = useIntl();
	(fundReceivedForm[2].optionsArray as { id: string; name: string }[]) = donorList;

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={false}
			title={intl.formatMessage({
				id: "fundReceivedFormTitle",
				defaultMessage: "Report Fund Received",
				description: `This text will be show on Fund Received form for title`,
			})}
			subtitle={intl.formatMessage({
				id: "fundReceivedFormSubtitle",
				defaultMessage: "Manage Fund Received",
				description: `This text will be show on Fund Received form for subtitle`,
			})}
			workspace={dashboardData?.workspace?.name}
			project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
		>
			<CommonForm
				initialValues={defaultFormValues}
				validate={validate}
				onCreate={() => {}}
				onCancel={handleClose}
				inputFields={fundReceivedForm}
				formAction={formAction}
				onUpdate={() => {}}
			/>
		</FormDialog>
	);
}

export default FundReceivedContainer;
