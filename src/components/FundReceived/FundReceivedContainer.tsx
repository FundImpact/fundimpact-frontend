import React, { useCallback } from "react";
import FormDialog from "../FormDialog";
import { FORM_ACTIONS } from "../../models/constants";
import { useIntl } from "react-intl";
import { useDashBoardData } from "../../contexts/dashboardContext";
import CommonForm from "../CommonForm";
import { IFundReceivedForm } from "../../models/fundReceived";
import { fundReceivedForm } from "./inputFields.json";
import { getTodaysDate } from "../../utils";
import { FetchResult, MutationFunctionOptions } from "@apollo/client";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setSuccessNotification, setErrorNotification } from "../../reducers/notificationReducer";
import { GET_PROJECT_AMOUNT_RECEIVED } from "../../graphql/project";

const defaultFormValues: IFundReceivedForm = {
	amount: "",
	project_donor: "",
	reporting_date: getTodaysDate(),
};

const validate = (values: IFundReceivedForm) => {
	let errors: Partial<IFundReceivedForm> = {};
	if (!values.amount) {
		errors.amount = "Amount is required";
	}
	if (!values.project_donor) {
		errors.project_donor = "Donor is required";
	}
	if (!values.reporting_date) {
		errors.reporting_date = "Date is required";
	}
	return errors;
};

const onFormSubmit = async ({
	valuesSubmitted,
	notificationDispatch,
	createFundReceipt,
	project,
}: {
	valuesSubmitted: IFundReceivedForm;
	notificationDispatch: React.Dispatch<any>;
	createFundReceipt: (
		options?: MutationFunctionOptions<any, Record<string, any>> | undefined
	) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
	project: number | string;
}) => {
	try {
		await createFundReceipt({
			variables: {
				input: valuesSubmitted,
			},
			update: (store, { data }) => {
				try {
					const fundReceived = store.readQuery<{ fundReceiptProjectTotalAmount: number }>(
						{
							query: GET_PROJECT_AMOUNT_RECEIVED,
							variables: {
								filter: {
									project,
								},
							},
						}
					);
					store.writeQuery<{ fundReceiptProjectTotalAmount: number }>({
						query: GET_PROJECT_AMOUNT_RECEIVED,
						variables: {
							filter: {
								project,
							},
						},
						data: {
							fundReceiptProjectTotalAmount:
								(fundReceived?.fundReceiptProjectTotalAmount || 0) +
								data?.createFundReceiptProjectInput?.amount,
						},
					});
				} catch (err) {}
			},
		});
		notificationDispatch(setSuccessNotification("Fund Received Reported"));
	} catch (err) {
		notificationDispatch(setErrorNotification(err.message));
	}
};

function FundReceivedContainer({
	formAction,
	open,
	handleClose,
	donorList,
	loading,
	createFundReceipt,
}: {
	formAction: FORM_ACTIONS;
	open: boolean;
	handleClose: () => void;
	donorList: { id: string; name: string }[];
	loading: boolean;
	createFundReceipt: (
		options?: MutationFunctionOptions<any, Record<string, any>> | undefined
	) => Promise<FetchResult<any, Record<string, any>, Record<string, any>>>;
}) {
	const dashboardData = useDashBoardData();
	const intl = useIntl();
	(fundReceivedForm[2].optionsArray as { id: string; name: string }[]) = donorList;
	const notificationDispatch = useNotificationDispatch();

	const onCreate = useCallback(
		async (valuesSubmitted: IFundReceivedForm) => {
			await onFormSubmit({
				valuesSubmitted,
				createFundReceipt,
				notificationDispatch,
				project: dashboardData?.project?.id || "",
			});
			handleClose();
		},
		[createFundReceipt, dashboardData, notificationDispatch]
	);

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={loading}
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
				onCreate={onCreate}
				onCancel={handleClose}
				inputFields={fundReceivedForm}
				formAction={formAction}
				onUpdate={() => {}}
			/>
		</FormDialog>
	);
}

export default FundReceivedContainer;
