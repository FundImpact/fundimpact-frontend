import { useMutation } from "@apollo/client";
import React from "react";
// import {
// 	IDeliverable,
// 	DeliverableProps,
// 	IDeliverableCategoryData,
// } from "../../models/deliverable/deliverable";
import { FullScreenLoader } from "../Loader/Loader";
import { GEOGRAPHIES_ACTIONS } from "./constants";
// import { DELIVERABLE_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	CREATE_DELIVERABLE_CATEGORY,
	GET_DELIVERABLE_ORG_CATEGORY,
	UPDATE_DELIVERABLE_CATEGORY,
	GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
} from "../../graphql/Deliverable/category";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GeographiesCountryForm } from "./inputField.json";
import { useDashBoardData } from "../../contexts/dashboardContext";
// import { IGetDeliverableCategory } from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
// import { useLocation } from "react-router";
import { DIALOG_TYPE } from "../../models/constants";
import DeleteModal from "../DeleteModal";
import {
	GeographiesProps,
	IGeographies,
	IGeographiesCountryData,
} from "../../models/geographies/geographies";
import { IGetGeographiesCountry } from "../../models/geographies/query";
import {
	CREATE_GEOGRAPHIES_COUNTRY,
	DELETE_GEOGRAPHIES_COUNTRY,
	GET_COUNTRY_DATA,
	UPDATE_GEOGRAPHIES_COUNTRY,
} from "../../graphql/Geographies/GeographyCountry";

function getInitialValues(props: GeographiesProps) {
	// function getInitialValues(props: DeliverableProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	// if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };

	return {
		name: "",
		code: "",
		// description: "",
		// organization: props.organization,
	};
}

function Geographies(props: GeographiesProps) {
	// function Geographies(props: DeliverableProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	let initialValues: IGeographies = getInitialValues(props);
	// let initialValues: IDeliverable = getInitialValues(props);
	const [createGeographiesCountry, { loading: creatingGeographiesCountry }] = useMutation(
		// CREATE_DELIVERABLE_CATEGORY
		CREATE_GEOGRAPHIES_COUNTRY
	);

	console.log("creatingGeographiesCountry", creatingGeographiesCountry);

	// const [createDeliverableCategory, { loading: creatingDeliverableCategory }] = useMutation(
	// 	CREATE_DELIVERABLE_CATEGORY
	// );
	const [updateGeographiesCountry, { loading: updatingGeographiesCountry }] = useMutation(
		// const [updateDeliverableCategory, { loading: updatingDeliverableCategory }] = useMutation(
		UPDATE_GEOGRAPHIES_COUNTRY
	);

	const [deleteGeographiesCountry] = useMutation(DELETE_GEOGRAPHIES_COUNTRY);

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	const onCreate = async (value: IGeographies) => {
		console.log("value", value);
		// const onCreate = async (value: IDeliverable) => {
		try {
			await createGeographiesCountry({
				// await createDeliverableCategory({
				variables: { input: { data: value } },
				refetchQueries: [
					{
						query: GET_COUNTRY_DATA,
						// query: GET_DELIVERABLE_ORG_CATEGORY,
						variables: { filter: { organization: value.organization } },
					},
				],
				update: async (store, { data: createGeographiesCountry }) => {
					// update: async (store, { data: createDeliverableCategoryData }) => {
					try {
						const count = await store.readQuery<{ geographiesCountryCount: number }>({
							// const count = await store.readQuery<{ deliverableCategoryCount: number }>({
							query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ geographiesCountryCount: number }>({
							// store.writeQuery<{ deliverableCategoryCount: number }>({
							query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								geographiesCountryCount:
									(count && count.geographiesCountryCount + 1) || 0,
								// deliverableCategoryCount:
								// 	(count && count.deliverableCategoryCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.geographiesCountryCount;
							// limit = count.deliverableCategoryCount;
						}
						// const dataRead = await store.readQuery<IGetDeliverableCategory>({
						const dataRead = await store.readQuery<IGetGeographiesCountry>({
							query: GET_DELIVERABLE_ORG_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});

						let geographiesCountries: IGeographiesCountryData[] = dataRead?.geographiesCountry
							? // let deliverableCategories: IDeliverableCategoryData[] = dataRead?.deliverableCategory
							  dataRead?.geographiesCountry
							: //   dataRead?.deliverableCategory
							  [];

						store.writeQuery<IGetGeographiesCountry>({
							// store.writeQuery<IGetDeliverableCategory>({
							query: GET_DELIVERABLE_ORG_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								geographiesCountry: [
									// deliverableCategory: [
									createGeographiesCountry,
									// createDeliverableCategoryData,
									...geographiesCountries,
									// ...deliverableCategories,
								],
							},
						});
					} catch (err) {
						// console.error(err);
					}
				},
			});
			notificationDispatch(setSuccessNotification("Geographies Country created !"));
			onCancel();
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error?.message));
		}
	};

	const onUpdate = async (value: IGeographies) => {
		try {
			const id = value.id;
			delete value.id;
			await updateGeographiesCountry({
				// await updateDeliverableCategory({
				variables: {
					input: {
						where: {
							id: id?.toString,
						},
						data: value,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Gepgraphies country updated !"));
			onCancel();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			onCancel();
		}
	};

	const onDelete = async () => {
		try {
			deleteGeographiesCountry({
				variables: {
					input: {
						where: {
							id: initialValues.id,
						},
					},
				},
			});
			// await updateGeographiesCountry({
			// 	variables: {
			// 		id: initialValues?.id,
			// 		input: {
			// 			deleted: true,
			// 			...geographiesCountryValues,
			// 			// ...deliverableCategoryValues,
			// 		},
			// 	},
			// 	refetchQueries: [
			// 		{
			// 			query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
			// 			variables: {
			// 				filter: {
			// 					organization: dashboardData?.organization?.id,
			// 				},
			// 			},
			// 		},
			// 	],
			// });
			notificationDispatch(setSuccessNotification("Geographies Country Delete Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	const validate = (values: IGeographies) => {
		// const validate = (values: IDeliverable) => {
		let errors: Partial<IGeographies> = {};
		// let errors: Partial<IDeliverable> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		// if (!values.organization) {
		// 	errors.organization = "Organization is required";
		// }
		return errors;
	};
	const intl = useIntl();

	console.log("props?.dialogType", props?.dialogType);

	if (props?.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={props.open}
				handleClose={onCancel}
				onDeleteConformation={onDelete}
				title="Delete Geographies Country Data"
				// title="Delete Deliverable Category"
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
						id: "deliverableCategoryFormTitle",
						defaultMessage: "Geographies Country",
						// defaultMessage: "Deliverable Category",
						description: `This text will be show on deliverable category form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableCategoryFormSubtitle",
					defaultMessage: "Manage Country Data",
					// defaultMessage: "Manage Deliverable Category",
					description: `This text will be show on deliverable category form for subtitle`,
				})}
				workspace={""}
				project={""}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: GeographiesCountryForm,
					}}
				/>
			</FormDialog>
			{creatingGeographiesCountry || updatingGeographiesCountry ? (
				// {creatingDeliverableCategory || updatingDeliverableCategory ? (
				<FullScreenLoader />
			) : null}
		</React.Fragment>
	);
}

export default Geographies;
