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
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";

import {
	CREATE_DELIVERABLE_UNIT,
	UPDATE_DELIVERABLE_UNIT_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { GEOGRAPHIES_ACTIONS } from "./constants";
// import { DELIVERABLE_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GeographiesGrampanchayatForm } from "./inputField.json";
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
	GoegraphiesGrampanchayatProps,
	IGeographiesGrampanchayat,
	IGeographiesGrampanchayatData,
} from "../../models/geographies/geographiesGrampanchayat";
import {
	CREATE_GEOGRAPHIES_GRAMPANCHAYAT,
	DELETE_GEOGRAPHIES_GRAMPANCHAYAT,
	GET_GRAMPANCHAYAT_DATA,
	UPDATE_GEOGRAPHIES_GRAMPANCHAYAT,
} from "../../graphql/Geographies/GeographiesGrampanchayat";

function getInitialValues(props: GoegraphiesGrampanchayatProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		district: "",
		// unit_type: "",
		// prefix_label: "",
		// suffix_label: "",
		// organization: props.organization,
	};
}

interface IError extends Omit<Partial<IGeographiesGrampanchayat>, "GeographiesGrampanchayat"> {
	GeographiesGrampanchayat?: string;
}

function GeographiesGrampanchayat(props: GoegraphiesGrampanchayatProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [createGrampanchayat, { loading: createGrampanchayatLoading }] = useMutation(
		CREATE_GEOGRAPHIES_GRAMPANCHAYAT,
		{
			refetchQueries: [{ query: GET_GRAMPANCHAYAT_DATA }],
		}
	);

	const [updateDeliverableUnit, { loading: updatingGeographiesGrampanchayat }] = useMutation(
		UPDATE_GEOGRAPHIES_GRAMPANCHAYAT,
		{
			refetchQueries: [{ query: GET_GRAMPANCHAYAT_DATA }],
		}
	);

	const [deleteGeographiesGrampanchayat] = useMutation(DELETE_GEOGRAPHIES_GRAMPANCHAYAT, {
		refetchQueries: [{ query: GET_GRAMPANCHAYAT_DATA }],
	});

	let initialValues: IGeographiesGrampanchayat = getInitialValues(props);

	const onCreate = async (valueSubmitted: IGeographiesGrampanchayat) => {
		const value = Object.assign({}, valueSubmitted);
		try {
			await createGrampanchayat({
				variables: { input: { data: value } },
				update: async (store, { data: createDeliverableUnitOrg }) => {
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
						const dataRead = await store.readQuery<IGetDeliverablUnit>({
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
						let deliverableUnits: IGeographiesGrampanchayatData[] = dataRead?.deliverableUnitOrg
							? // let deliverableUnits: IDeliverableUnitData[] = dataRead?.deliverableUnitOrg
							  dataRead?.deliverableUnitOrg
							: [];

						store.writeQuery<IGetDeliverablUnit>({
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
								deliverableUnitOrg: [createDeliverableUnitOrg, ...deliverableUnits],
							},
						});
					} catch (err) {
						console.error(err);
					}
				},
				refetchQueries: [
					{
						query: GET_GRAMPANCHAYAT_DATA,
						// variables: { filter: { organization: dashboardData?.organization?.id } },
					},
				],
			});
			notificationDispatch(
				setSuccessNotification("Geographies Grampanchayat creation Success !")
			);
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const onUpdate = async (value: IGeographiesGrampanchayat) => {
		try {
			const id = value.id;

			delete value.id;
			await updateDeliverableUnit({
				variables: {
					input: {
						where: {
							id: id?.toString(),
						},
						data: value,
					},
				},
			});
			// //remove newDeliverableCategories
			// await changeDeliverableCategoryUnitStatus({
			// 	updateDeliverableCategoryUnit,
			// 	deliverableCategoryUnitList:
			// 		deliverableCategoryUnitList?.deliverableCategoryUnitList || [],
			// 	submittedDeliverableCategory,
			// });
			notificationDispatch(
				setSuccessNotification("Geographies Grampanchayat updation created !")
			);
			onCancel();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			onCancel();
		}
	};

	const validate = (values: IGeographiesGrampanchayat) => {
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
			deleteGeographiesGrampanchayat({
				variables: {
					input: {
						where: {
							id: initialValues.id,
						},
					},
				},
			});
			// await updateDeliverableUnit({
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
			notificationDispatch(setSuccessNotification("Gegraphies Grampanchayat Delete Success"));
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
				title="Delete Geographies Grampanchayat"
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
						defaultMessage: "Geographies GramPanchayat",
						description: `This text will be show on deliverable unit form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableUnitFormSubtitle",
					defaultMessage: "Manage Geographies GramPanchayat data here",
					description: `This text will be show on deliverable unit form for subtitle`,
				})}
				workspace={""}
				project={""}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createGrampanchayatLoading || updatingGeographiesGrampanchayat}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: GeographiesGrampanchayatForm,
					}}
				/>
			</FormDialog>
		</React.Fragment>
	);
}

export default GeographiesGrampanchayat;
