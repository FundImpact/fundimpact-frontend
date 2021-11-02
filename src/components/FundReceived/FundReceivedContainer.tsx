import React, { useCallback, useMemo, useState } from "react";
import FormDialog from "../FormDialog";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../models/constants";
import { useIntl } from "react-intl";
import { useDashBoardData } from "../../contexts/dashboardContext";
import CommonForm from "../CommonForm";
import { IFundReceivedForm } from "../../models/fundReceived";
import { fundReceivedForm } from "./inputFields.json";
import { FetchResult, MutationFunctionOptions, ApolloCache, useQuery } from "@apollo/client";
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
import Donor from "../Donor";
import { DONOR_DIALOG_TYPE } from "../../models/donor/constants";
import { IGET_DONOR } from "../../models/donor/query";
import {
	IGetProjectDonor,
	ICreateProjectDonor,
	ICreateProjectDonorVariables,
} from "../../models/project/project";
// import { DonorType } from "../../models/fundReceived/conatsnt";
import DeleteModal from "../DeleteModal";
import { useProjectDonorSelectInput } from "../../hooks/project";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { GET_GRANT_PERIOD } from "../../graphql";

interface IFundReceivedContainerProps {
	formAction: FORM_ACTIONS;
	open: boolean;
	handleClose: () => void;
	projectDonors: IGetProjectDonor["projectDonors"];
	loading: boolean;
	dialogType?: DIALOG_TYPE;
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
	orgDonors: IGET_DONOR["orgDonors"];
	createProjectDonor: (
		options?:
			| MutationFunctionOptions<ICreateProjectDonor, ICreateProjectDonorVariables>
			| undefined
	) => Promise<FetchResult<ICreateProjectDonor, Record<string, any>, Record<string, any>>>;
}

interface IFormSubmitProps {
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
	createProjectDonor: () => Promise<string | undefined>;
	projectDonors: IGetProjectDonor["projectDonors"];
}

interface IUpdateFundReceiptProps {
	valuesSubmitted: IFundReceivedForm;
	updateFundReceipt: (
		options?:
			| MutationFunctionOptions<IUpdateFundReceipt, IUpdateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<IUpdateFundReceipt, Record<string, any>, Record<string, any>>>;
	project: string | number;
	fundReceiptToUpdate: IFundReceivedForm;
}

interface ICreateProjectFundReceipt {
	valuesSubmitted: IFundReceivedForm;
	createFundReceipt: (
		options?:
			| MutationFunctionOptions<ICreateFundReceipt, ICreateFundReceiptVariables>
			| undefined
	) => Promise<FetchResult<ICreateFundReceipt, Record<string, any>, Record<string, any>>>;
	project: number | string;
}

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

// const getDonors = ({
// 	projectDonors,
// 	orgDonors,
// }: {
// 	projectDonors: IGetProjectDonor["projectDonors"];
// 	orgDonors: IGET_DONOR["orgDonors"];
// }) => {
// 	let projectDonorIdHash = projectDonors.reduce((acc: { [key: string]: boolean }, projDonor) => {
// 		acc[projDonor.donor.id] = true;
// 		return acc;
// 	}, {});
// 	let donorArr = [];
// 	projectDonors.length &&
// 		donorArr.push(
// 			{
// 				groupName: (
// 					<FormattedMessage
// 						id="selectInputProjectDonor"
// 						defaultMessage="PROJECT'S DONOR"
// 						description="This text will be heading of project donor"
// 					/>
// 				),
// 			},
// 			...projectDonors
// 				.filter((donor) => donor)
// 				.map((projDonor) => ({
// 					id: projDonor.id + `-${DonorType.project}`,
// 					name: projDonor.donor.name,
// 				}))
// 		);

// 	let filteredOrgDonor = orgDonors
// 		.filter((donor) => !projectDonorIdHash[donor.id])
// 		.map((donor) => ({ id: donor.id + `-${DonorType.organization}`, name: donor.name }));

// 	filteredOrgDonor.length &&
// 		donorArr.push(
// 			{
// 				groupName: (
// 					<FormattedMessage
// 						id="selectInputAllDonor"
// 						defaultMessage="ALL DONORS"
// 						description="This text will be heading of all donor"
// 					/>
// 				),
// 			},
// 			...filteredOrgDonor
// 		);

// 	return donorArr;
// };

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
		console.error(err);
	}
};

const createProjectFundReceipt = async ({
	createFundReceipt,
	valuesSubmitted,
	project,
}: ICreateProjectFundReceipt) => {
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
				console.error(err);
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

// const getDonorIdForGivenProjectDonor = (
// 	projectDonors: IGetProjectDonor["projectDonors"],
// 	projectDonorId: string
// ) => projectDonors.find((projectDonor) => projectDonor.id == projectDonorId)?.donor.id;

const updateProjectFundReceipt = async ({
	valuesSubmitted,
	updateFundReceipt,
	project,
	fundReceiptToUpdate,
}: IUpdateFundReceiptProps) => {
	const fundReceiptId = valuesSubmitted.id;
	delete valuesSubmitted.id;
	await updateFundReceipt({
		variables: {
			id: fundReceiptId || "",
			input: {
				amount: parseInt(valuesSubmitted.amount),
				project_donor: valuesSubmitted.project_donor,
				reporting_date: valuesSubmitted.reporting_date,
				project: valuesSubmitted.project,
				donor: valuesSubmitted?.donor,
			},
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
				console.error(err);
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
	createProjectDonor,
	projectDonors,
}: IFormSubmitProps) => {
	try {
		// if (donorSelected === DonorType.organization) {
		// 	let createdProjectDonor = await createProjectDonor({
		// 		variables: {
		// 			input: {
		// 				donor: valuesSubmitted.project_donor.split("-")[0],
		// 				project: `${project}` || "",
		// 			},
		// 		},
		// 	});
		// 	if (createdProjectDonor.data) {
		// 		projectDonorId = createdProjectDonor.data.createProjDonor.id;
		// 	}
		// }
		const projectDonorId = await createProjectDonor();

		formAction === FORM_ACTIONS.CREATE &&
			(await createProjectFundReceipt({
				valuesSubmitted: {
					...valuesSubmitted,
					project_donor: projectDonorId || "",
					project,
					donor: valuesSubmitted.project_donor as string,
				},
				createFundReceipt,
				project,
			}));

		formAction === FORM_ACTIONS.UPDATE &&
			(await updateProjectFundReceipt({
				valuesSubmitted: {
					...valuesSubmitted,
					project_donor: projectDonorId || "",
					donor: valuesSubmitted.project_donor as string,
					project,
				},
				updateFundReceipt,
				project,
				fundReceiptToUpdate: initialFormValues,
			}));

		notificationDispatch(setSuccessNotification("Fund Received Reported"));
	} catch (err: any) {
		notificationDispatch(setErrorNotification(err.message));
	}
};

function FundReceivedContainer({
	formAction,
	open,
	handleClose,
	projectDonors,
	loading,
	createFundReceipt,
	initialValues,
	updateFundReceipt,
	orgDonors,
	dialogType,
}: IFundReceivedContainerProps) {
	const dashboardData = useDashBoardData();
	const intl = useIntl();

	const {
		createProjectDonor,
		selectedDonorInputOptionArray,
		setSelectedDonor,
		showCreateProjectDonorCheckbox,
		creatingProjectDonors,
		setCreateProjectDonorCheckboxVal,
	} = useProjectDonorSelectInput({
		formAction,
		initialDonorId: `${initialValues.donor}`,
	});

	(fundReceivedForm[2].optionsArray as any) = selectedDonorInputOptionArray;

	fundReceivedForm[2].getInputValue = (donorId: string) => {
		setCurrentDonor(donorId);
	};
	(fundReceivedForm[2].helperText as any) = showCreateProjectDonorCheckbox && (
		<FormControlLabel
			control={
				<Checkbox
					onChange={(e) => {
						e.persist();
						setCreateProjectDonorCheckboxVal(e?.target?.checked);
					}}
					size="small"
					inputProps={{ "aria-label": "make selected donor project donor" }}
				/>
			}
			label="Make org donor project donor"
		/>
	);
	const notificationDispatch = useNotificationDispatch();
	const [openDonorCreateDialog, setOpenDonorCreateDialog] = useState<boolean>(false);

	const [currentDonor, setCurrentDonor] = useState<null | string | number>(null);

	const { data: grantPeriods } = useQuery(GET_GRANT_PERIOD, {
		variables: { filter: { donor: currentDonor, project: dashboardData?.project?.id } },
		skip: !currentDonor || !dashboardData?.project?.id,
	});

	const submitForm = useCallback(
		async (valuesSubmitted: IFundReceivedForm) => {
			// console.log("ccc", valuesSubmitted);
			await onFormSubmit({
				valuesSubmitted,
				createFundReceipt,
				notificationDispatch,
				project: dashboardData?.project?.id || "",
				formAction,
				updateFundReceipt,
				initialFormValues: initialValues,
				createProjectDonor,
				projectDonors,
			});
			handleClose();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	fundReceivedForm[2].getInputValue = (donorId: string) => {
		setCurrentDonor(donorId);
		setSelectedDonor(donorId);
	};

	fundReceivedForm[2].addNewClick = () => setOpenDonorCreateDialog(true);
	fundReceivedForm[3].optionsArray = useMemo(() => grantPeriods?.grantPeriodsProjectList, [
		grantPeriods,
	]);
	const updateFundReceivedSubtitle = intl.formatMessage({
		id: "FundReceivedUpdateFormSubtitle",
		defaultMessage: "Update Fund Recevied For Project",
		description: `This text will be show on update Fund Recevied form`,
	});

	const createFundReceivedSubtitle = intl.formatMessage({
		id: "FundReceivedCreateFormSubtitle",
		defaultMessage: "Report Fund Recevied For Project",
		description: `This text will be show on create Fund Recevied form`,
	});

	const onDelete = async () => {
		try {
			const fundReceivedValues = { ...initialValues };
			delete fundReceivedValues["id"];
			await updateFundReceipt({
				variables: {
					id: initialValues?.id as string,
					input: {
						deleted: true,
						...fundReceivedValues,
						amount: Number(fundReceivedValues.amount),
						project_donor: fundReceivedValues?.project_donor?.split?.("-")?.[0],
					},
				},
				refetchQueries: [
					{
						query: GET_PROJECT_AMOUNT_RECEIVED,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Fund Receipt Delete Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	if (dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={open}
				handleClose={handleClose}
				onDeleteConformation={onDelete}
				title="Delete Fund Receipt"
			/>
		);
	}

	return (
		<>
			<Donor
				open={openDonorCreateDialog}
				formAction={FORM_ACTIONS.CREATE}
				handleClose={() => setOpenDonorCreateDialog(false)}
				dialogType={DONOR_DIALOG_TYPE.PROJECT}
				projectId={`${dashboardData?.project?.id}`}
			/>
			<FormDialog
				handleClose={handleClose}
				open={open}
				loading={loading || creatingProjectDonors}
				title={intl.formatMessage({
					id: "fundReceivedFormTitle",
					defaultMessage: "Report Fund Received",
					description: `This text will be show on Fund Received form for title`,
				})}
				subtitle={
					formAction === FORM_ACTIONS.CREATE
						? createFundReceivedSubtitle
						: updateFundReceivedSubtitle
				}
				workspace={dashboardData?.project?.workspace?.name || ""}
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
		</>
	);
}

export default FundReceivedContainer;
