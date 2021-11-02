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
	CREATE_DELIVERABLE_UNIT,
	UPDATE_DELIVERABLE_UNIT_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { GEOGRAPHIES_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GeographiesDistrictForm } from "./inputField.json";
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
	GoegraphiesDistrictProps,
	IGeographiesDistrict,
	IGeographiesDistrictData,
} from "../../models/geographies/geographiesDistrict";
import {
	CREATE_GEOGRAPHIES_DISTRICT,
	DELETE_GEOGRAPHIES_DISTRICT,
	GET_DISTRICT_DATA,
	UPDATE_GEOGRAPHIES_DISTRICT,
} from "../../graphql/Geographies/GeographiesDistrict";
import { GET_STATE_DATA } from "../../graphql/Geographies/GeographyState";

function getInitialValues(props: GoegraphiesDistrictProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		state: "",
		// description: "",
		// unit_type: "",
		// prefix_label: "",
		// suffix_label: "",
		// organization: props.organization,
	};
}

interface IError extends Omit<Partial<IGeographiesDistrict>, "GeographiesDistrict"> {
	deliverableCategory?: string;
}

function GeographiesDistrict(props: GoegraphiesDistrictProps) {
	const [getStateDropdown, stateDropdownResponse] = useLazyQuery(GET_STATE_DATA);

	useEffect(() => {
		getStateDropdown();
	}, []);

	GeographiesDistrictForm[2].optionsArray = stateDropdownResponse?.data?.states;
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [createDistrict, { loading: createDistrictLoading }] = useMutation(
		CREATE_GEOGRAPHIES_DISTRICT,
		{
			refetchQueries: [{ query: GET_DISTRICT_DATA }],
		}
	);

	const [updateGeographiesDistrict, { loading: updatingGeographiesDistrict }] = useMutation(
		UPDATE_GEOGRAPHIES_DISTRICT,
		{
			refetchQueries: [{ query: GET_DISTRICT_DATA }],
		}
	);

	const [deleteGeographiesDistrict] = useMutation(DELETE_GEOGRAPHIES_DISTRICT, {
		refetchQueries: [{ query: GET_DISTRICT_DATA }],
	});

	let initialValues: IGeographiesDistrict = getInitialValues(props);
	const onCreate = async (valueSubmitted: IGeographiesDistrict) => {
		const value = Object.assign({}, valueSubmitted);
		try {
			await createDistrict({
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
						let deliverableUnits: IGeographiesDistrictData[] = dataRead?.deliverableUnitOrg
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
						query: GET_DISTRICT_DATA,
						// variables: { filter: { organization: dashboardData?.organization?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Geographies District creation Success !"));
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const onUpdate = async (value: IGeographiesDistrict) => {
		try {
			const id = value.id;

			delete value.id;
			await updateGeographiesDistrict({
				variables: {
					input: {
						where: {
							id: id?.toString(),
						},
						data: value,
					},
				},
			});

			notificationDispatch(setSuccessNotification("Geographies district updation created !"));
			onCancel();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			onCancel();
		}
	};

	const validate = (values: IGeographiesDistrict) => {
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
			deleteGeographiesDistrict({
				variables: {
					input: {
						where: {
							id: initialValues.id,
						},
					},
				},
			});
			// await updateGeographiesDistrict({
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
			notificationDispatch(setSuccessNotification("Gegraphies District Delete Success"));
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
				title="Delete Geographies District test"
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
						defaultMessage: "Geographies District",
						description: `This text will be show on deliverable unit form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableUnitFormSubtitle",
					defaultMessage: "Manage Geographies District data here",
					description: `This text will be show on deliverable unit form for subtitle`,
				})}
				workspace={""}
				project={""}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createDistrictLoading || updatingGeographiesDistrict}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: GeographiesDistrictForm,
					}}
				/>
			</FormDialog>
		</React.Fragment>
	);
}

export default GeographiesDistrict;
