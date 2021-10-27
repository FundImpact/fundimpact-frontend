import {
	useMutation,
	// useQuery,
	// ApolloCache,
	// useLazyQuery,
	// FetchResult,
	// MutationFunctionOptions,
} from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
// import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";

import {
	CREATE_DELIVERABLE_UNIT,
	UPDATE_DELIVERABLE_UNIT_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { GEOGRAPHIES_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GeographiesStateForm } from "./inputField.json";
import {
	IGetDeliverablUnit,
	// IGetDeliverableCategoryUnit,
	// IGetDeliverableCategoryUnitVariables,
	// IUpdateDeliverableCategoryUnit,
	// IUpdateDeliverableCategoryUnitVariables,
} from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";

import DeleteModal from "../DeleteModal";
import { DIALOG_TYPE } from "../../models/constants";
import {
	GoegraphiesStateProps,
	IGeographiesState,
	IGeographiesStateData,
} from "../../models/geographies/geographiesState";
import { IGetGeographieState } from "../../models/geographies/query";
import {
	CREATE_GEOGRAPHIES_STATE,
	DELETE_GEOGRAPHIES_STATE,
	GET_STATE_DATA,
	UPDATE_GEOGRAPHIES_STATE,
} from "../../graphql/Geographies/GeographyState";
import id from "date-fns/esm/locale/id/index.js";

function getInitialValues(props: GoegraphiesStateProps) {
	// function getInitialValues(props: DeliverableUnitProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	// if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		country: "",
		// description: "",
		// unit_type: "",
		// prefix_label: "",
		// suffix_label: "",
		// organization: props.organization,
	};
}

interface IError extends Omit<Partial<IGeographiesState>, "GeographiesState"> {
	// interface IError extends Omit<Partial<IDeliverableUnit>, "deliverableCategory"> {
	GeographiesState?: string;
}

function GeographiesState(props: GoegraphiesStateProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [createState, { loading: createStateLoading }] = useMutation(CREATE_GEOGRAPHIES_STATE);

	const [updateGeographiesState, { loading: updatingGeographiesState }] = useMutation(
		UPDATE_GEOGRAPHIES_STATE
	);

	const [deleteGeographiesState, { loading: deleteStateLoading }] = useMutation(
		DELETE_GEOGRAPHIES_STATE
	);

	let initialValues: IGeographiesState = getInitialValues(props);
	console.log("initialValues", initialValues);

	const onCreate = async (valueSubmitted: IGeographiesState) => {
		const value = Object.assign({}, valueSubmitted);

		try {
			await createState({
				variables: { input: { data: value } },
				update: async (store, { data: createGeographiesStateOrg }) => {
					try {
						const count = await store.readQuery<{ deliverableUnitOrgCount: number }>({
							query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ deliverableUnitOrgCount: number }>({
							query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								deliverableUnitOrgCount:
									(count && count.deliverableUnitOrgCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.deliverableUnitOrgCount;
						}
						const dataRead = await store.readQuery<IGetGeographieState>({
							// const dataRead = await store.readQuery<IGetDeliverablUnit>({
							query: GET_DELIVERABLE_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let geographiesState: IGeographiesStateData[] = dataRead?.geographiesStateOrg
							? // let deliverableUnits: IDeliverableUnitData[] = dataRead?.deliverableUnitOrg
							  dataRead?.geographiesStateOrg
							: [];

						store.writeQuery<IGetGeographieState>({
							// store.writeQuery<IGetDeliverablUnit>({
							query: GET_DELIVERABLE_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								geographiesStateOrg: [
									createGeographiesStateOrg,
									...geographiesState,
								],
								// deliverableUnitOrg: [createDeliverableUnitOrg, ...deliverableUnits],
							},
						});
					} catch (err) {
						console.error(err);
					}
				},
				refetchQueries: [
					{
						query: GET_STATE_DATA,
						variables: { filter: { organization: dashboardData?.organization?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Geographies State creation Success !"));
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const onUpdate = async (value: IGeographiesState) => {
		try {
			const id = value.id;

			delete value.id;
			await updateGeographiesState({
				variables: {
					input: {
						where: {
							id: id?.toString(),
						},
						data: value,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Geographies State updation created !"));
			onCancel();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			onCancel();
		}
	};

	const validate = (values: IGeographiesState) => {
		let errors: IError = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		// if (!values.organization) {
		// 	errors.organization = "Organization is required";
		// }
		return errors;
	};

	const onDelete = async () => {
		try {
			deleteGeographiesState({
				variables: {
					input: {
						where: {
							id: initialValues.id,
						},
					},
				},
			});
			// await updateGeographiesState({
			// 	variables: {
			// 		id: initialValues?.id,
			// 		input: {
			// 			deleted: true,
			// 			...deliverableUnitValues,
			// 		},
			// 	},
			// 	refetchQueries: [
			// 		{
			// 			query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
			// 			variables: {
			// 				filter: {
			// 					organization: dashboardData?.organization?.id,
			// 				},
			// 			},
			// 		},
			// 	],
			// });
			notificationDispatch(setSuccessNotification("Gegraphies State Delete Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				handleClose={onCancel}
				onDeleteConformation={onDelete}
				open={props.open}
				title="Delete  Geographies State"
			/>
		);
	}
	return (
		<React.Fragment>
			<FormDialog
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "deliverableUnitFormTitle",
						defaultMessage: "Geographies State",
						description: `This text will be show on deliverable unit form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableUnitFormSubtitle",
					defaultMessage: "Manage Geographies State data here",
					description: `This text will be show on deliverable unit form for subtitle`,
				})}
				workspace={""}
				project={""}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createStateLoading || updatingGeographiesState}
				// loading={createUnitLoading || updatingDeliverableUnit}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: GeographiesStateForm,
					}}
				/>
				{/* {openDeliverableCategoryDialog && (
					<Deliverable
						type={DELIVERABLE_ACTIONS.CREATE}
						open={openDeliverableCategoryDialog}
						handleClose={() => setOpenDeliverableCategoryDialog(false)}
						organization={dashboardData?.organization?.id}
					/>
				)} */}
			</FormDialog>
		</React.Fragment>
	);
}

export default GeographiesState;
