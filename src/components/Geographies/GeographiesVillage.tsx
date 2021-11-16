import {
	useLazyQuery,
	useMutation,
	// useQuery,
	// ApolloCache,
	// useLazyQuery,
	// FetchResult,
	// MutationFunctionOptions,
} from "@apollo/client";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { GEOGRAPHIES_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GeographiesVillageForm } from "./inputField.json";
import { IGetDeliverablUnit } from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import DeleteModal from "../DeleteModal";
import { DIALOG_TYPE } from "../../models/constants";
import {
	GeographiesVillageProps,
	IGeographiesVillage,
	IGeographiesVillageData,
} from "../../models/geographies/geographiesVillage";
import {
	CREATE_GEOGRAPHIES_VILLAGE,
	DELETE_GEOGRAPHIES_VILLAGE,
	GET_VILLAGE_COUNT,
	GET_VILLAGE_DATA,
	UPDATE_GEOGRAPHIES_VILLAGE,
} from "../../graphql/Geographies/GeographiesVillage";
import { GET_BLOCK_DATA } from "../../graphql/Geographies/GeographiesBlock";

function getInitialValues(props: GeographiesVillageProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		block: "",
		// unit_type: "",
		// prefix_label: "",
		// suffix_label: "",
		// organization: props.organization,
	};
}

interface IError extends Omit<Partial<IGeographiesVillage>, "GeographiesVillage"> {
	GeographiesVillage?: string;
}

function GeographiesVillage(props: GeographiesVillageProps) {
	const [getVillageDropdown, villageDropdownResponse] = useLazyQuery(GET_BLOCK_DATA);

	useEffect(() => {
		getVillageDropdown();
	}, []);

	GeographiesVillageForm[2].optionsArray = villageDropdownResponse?.data?.blocks;
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [createVillage, { loading: createGeographiesLoading }] = useMutation(
		CREATE_GEOGRAPHIES_VILLAGE
	);

	const [updateGeographiesVillage, { loading: updatingGeographiesVillge }] = useMutation(
		UPDATE_GEOGRAPHIES_VILLAGE
	);

	const [deleteGeographiesVillage] = useMutation(DELETE_GEOGRAPHIES_VILLAGE);

	let initialValues: IGeographiesVillage = getInitialValues(props);
	const onCreate = async (valueSubmitted: IGeographiesVillage) => {
		const value = Object.assign({}, valueSubmitted);
		try {
			await createVillage({
				variables: { input: { data: value } },
				refetchQueries: [
					{
						query: GET_VILLAGE_DATA,
					},
					{
						query: GET_VILLAGE_COUNT,
					},
				],
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
						let deliverableUnits: IGeographiesVillageData[] = dataRead?.deliverableUnitOrg
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
			});
			notificationDispatch(setSuccessNotification("Geographies Village creation Success !"));
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const onUpdate = async (value: IGeographiesVillage) => {
		try {
			const id = value.id;

			delete value.id;
			await updateGeographiesVillage({
				variables: {
					input: {
						where: {
							id: id?.toString(),
						},
						data: value,
					},
				},
				refetchQueries: [
					{
						query: GET_VILLAGE_DATA,
					},
					{
						query: GET_VILLAGE_COUNT,
					},
				],
			});
			// //remove newDeliverableCategories
			// await changeDeliverableCategoryUnitStatus({
			// 	updateDeliverableCategoryUnit,
			// 	deliverableCategoryUnitList:
			// 		deliverableCategoryUnitList?.deliverableCategoryUnitList || [],
			// 	submittedDeliverableCategory,
			// });
			notificationDispatch(setSuccessNotification("Geographies Village updated !"));
			onCancel();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			onCancel();
		}
	};

	const validate = (values: IGeographiesVillage) => {
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
			deleteGeographiesVillage({
				variables: {
					input: {
						where: {
							id: initialValues.id,
						},
					},
				},
				refetchQueries: [
					{
						query: GET_VILLAGE_DATA,
					},
					{
						query: GET_VILLAGE_COUNT,
					},
				],
			});
			// await updateGeographiesVillage({
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
			notificationDispatch(setSuccessNotification("Gegraphies Village Delete Success"));
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
				title="Delete Geographies Village"
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
						defaultMessage: "Geographies Village",
						description: `This text will be show on deliverable unit form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableUnitFormSubtitle",
					defaultMessage: "Manage Geographies Village data here",
					description: `This text will be show on deliverable unit form for subtitle`,
				})}
				workspace={""}
				project={""}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createGeographiesLoading || updatingGeographiesVillge}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: GeographiesVillageForm,
					}}
				/>
			</FormDialog>
		</React.Fragment>
	);
}

export default GeographiesVillage;
