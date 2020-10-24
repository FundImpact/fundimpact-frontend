import React, { useCallback } from "react";
import FormDialog from "../FormDialog";
import { FORM_ACTIONS } from "../../models/constants";
import { useIntl } from "react-intl";
import { useDashBoardData } from "../../contexts/dashboardContext";
import CommonForm from "../CommonForm";
import { IFundReceivedForm } from "../../models/fundReceived";
import { fundReceivedForm } from "./inputFields.json";
import { FetchResult, MutationFunctionOptions, ApolloCache } from "@apollo/client";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setSuccessNotification, setErrorNotification } from "../../reducers/notificationReducer";
import { GET_PROJECT_AMOUNT_RECEIVED } from "../../graphql/project";
import {
	ICreateFundReceiptVariables,
	ICreateFundReceipt,
	IUpdateFundReceipt,
	IUpdateFundReceiptVariables,
} from "../../models/fundReceived/query";
import {
	GET_FUND_RECEIPT_PROJECT_LIST,
	GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
} from "../../graphql/FundRecevied";

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

const updateFundReceiptProjectTotalAmount = ({
	store,
	project,
	fundReceipt,
}: {
	store: ApolloCache<ICreateFundReceipt | IUpdateFundReceipt>;
	project: string | number;
	fundReceipt: ICreateFundReceipt["createFundReceiptProjectInput"];
}) => {
	const fundReceived = store.readQuery<{ fundReceiptProjectTotalAmount: number }>({
		query: GET_PROJECT_AMOUNT_RECEIVED,
		variables: {
			filter: {
				project,
			},
		},
	});

	store.writeQuery<{ fundReceiptProjectTotalAmount: number }>({
		query: GET_PROJECT_AMOUNT_RECEIVED,
		variables: {
			filter: {
				project,
			},
		},
		data: {
			fundReceiptProjectTotalAmount:
				(fundReceived?.fundReceiptProjectTotalAmount || 0) + fundReceipt.amount,
		},
	});
};

const updateFundReceiptListCount = (
	store: ApolloCache<ICreateFundReceipt | IUpdateFundReceipt>,
	project: number | string
) => {
	try {
		let fundReceiptListCountCache = store.readQuery<{ fundReceiptProjectListCount: number }>({
			query: GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
			variables: {
				filter: {
					project,
				},
			},
		});

		store.writeQuery<{ fundReceiptProjectListCount: number }>({
			query: GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
			variables: {
				filter: {
					project,
				},
			},
			data: {
				fundReceiptProjectListCount:
					(fundReceiptListCountCache &&
						fundReceiptListCountCache?.fundReceiptProjectListCount + 1) ||
					0,
			},
		});
	} catch (err) {
		console.error(err)
	}
};

const createProjectFundReceipt = async ({
	createFundReceipt,
	valuesSubmitted,
	project,
}: {
	valuesSubmitted: IFundReceivedForm;
	createFundReceipt: (
		options?:
			| MutationFunctionOptions<ICreateFundReceipt, ICreateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<ICreateFundReceipt, Record<string, any>, Record<string, any>>>;
	project: number | string;
}) => {
	await createFundReceipt({
		variables: {
			input: valuesSubmitted,
		},
		update: (store, { data }) => {
			try {
				if (!data) {
					return;
				}

				updateFundReceiptProjectTotalAmount({
					project,
					store,
					fundReceipt: data.createFundReceiptProjectInput,
				});
				updateFundReceiptListCount(store, project);
			} catch (err) {
				console.error(err)
			}
		},
		refetchQueries: [
			{
				query: GET_FUND_RECEIPT_PROJECT_LIST,
				variables: {
					filter: {
						project,
					},
					limit: 10,
					start: 0,
					sort: "created_at:DESC",
				},
			},
		],
	});
};

const getChangeInFundReceiptAmount = (
	updatedFundReceipt: ICreateFundReceipt["createFundReceiptProjectInput"],
	fundReceiptToUpdate: IFundReceivedForm
) => updatedFundReceipt.amount - +fundReceiptToUpdate.amount;

const updateProjectFundReceipt = async ({
	valuesSubmitted,
	updateFundReceipt,
	project,
	fundReceiptToUpdate,
}: {
	valuesSubmitted: IFundReceivedForm;
	updateFundReceipt: (
		options?:
			| MutationFunctionOptions<IUpdateFundReceipt, IUpdateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<IUpdateFundReceipt, Record<string, any>, Record<string, any>>>;
	project: string | number;
	fundReceiptToUpdate: IFundReceivedForm;
}) => {
	const fundReceiptId = valuesSubmitted.id;
	delete valuesSubmitted.id;
	await updateFundReceipt({
		variables: {
			id: fundReceiptId || "",
			input: valuesSubmitted,
		},
		update: (store, { data }) => {
			try {
				if (!data) {
					return;
				}
				let updatedFundReceipt = { ...data.updateFundReceiptProjectInput };
				updatedFundReceipt.amount = getChangeInFundReceiptAmount(
					updatedFundReceipt,
					fundReceiptToUpdate
				);
				updateFundReceiptProjectTotalAmount({
					project,
					store,
					fundReceipt: updatedFundReceipt,
				});
			} catch (err) {
				console.error(err)
			}
		},
	});
};

const onFormSubmit = async ({
	valuesSubmitted,
	notificationDispatch,
	createFundReceipt,
	project,
	formAction,
	updateFundReceipt,
	initialFormValues,
}: {
	valuesSubmitted: IFundReceivedForm;
	notificationDispatch: React.Dispatch<any>;
	createFundReceipt: (
		options?:
			| MutationFunctionOptions<ICreateFundReceipt, ICreateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<ICreateFundReceipt, Record<string, any>, Record<string, any>>>;
	project: number | string;
	formAction: FORM_ACTIONS;
	updateFundReceipt: (
		options?:
			| MutationFunctionOptions<IUpdateFundReceipt, IUpdateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<IUpdateFundReceipt, Record<string, any>, Record<string, any>>>;
	initialFormValues: IFundReceivedForm;
}) => {
	try {
		formAction == FORM_ACTIONS.CREATE &&
			(await createProjectFundReceipt({ valuesSubmitted, createFundReceipt, project }));

		formAction == FORM_ACTIONS.UPDATE &&
			(await updateProjectFundReceipt({
				valuesSubmitted,
				updateFundReceipt,
				project,
				fundReceiptToUpdate: initialFormValues,
			}));

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
	initialValues,
	updateFundReceipt,
}: {
	formAction: FORM_ACTIONS;
	open: boolean;
	handleClose: () => void;
	donorList: { id: string; name: string }[];
	loading: boolean;
	createFundReceipt: (
		options?:
			| MutationFunctionOptions<ICreateFundReceipt, ICreateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<ICreateFundReceipt, Record<string, any>, Record<string, any>>>;
	initialValues: IFundReceivedForm;
	updateFundReceipt: (
		options?:
			| MutationFunctionOptions<IUpdateFundReceipt, IUpdateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<IUpdateFundReceipt, Record<string, any>, Record<string, any>>>;
}) {
	const dashboardData = useDashBoardData();
	const intl = useIntl();
	(fundReceivedForm[2].optionsArray as { id: string; name: string }[]) = donorList;
	const notificationDispatch = useNotificationDispatch();
	const submitForm = useCallback(
		async (valuesSubmitted: IFundReceivedForm) => {
			await onFormSubmit({
				valuesSubmitted,
				createFundReceipt,
				notificationDispatch,
				project: dashboardData?.project?.id || "",
				formAction,
				updateFundReceipt,
				initialFormValues: initialValues,
			});
			handleClose();
		},
		[
			createFundReceipt,
			dashboardData,
			updateFundReceipt,
			notificationDispatch,
			initialValues,
			formAction,
			handleClose,
		]
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
				initialValues={initialValues}
				validate={validate}
				onCreate={submitForm}
				onCancel={handleClose}
				inputFields={fundReceivedForm}
				formAction={formAction}
				onUpdate={submitForm}
			/>
		</FormDialog>
	);
}

export default FundReceivedContainer;
