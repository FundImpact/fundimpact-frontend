import { useMutation } from "@apollo/client";
import React from "react";
// import {
// 	IDeliverable,
// 	DeliverableProps,
// 	IDeliverableCategoryData,
// } from "../../models/deliverable/deliverable";
import { FullScreenLoader } from "../Loader/Loader";
import { GEOGRAPHIES_ACTIONS } from "./constants";
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
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
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
	GET_COUNTRY_COUNT,
	GET_COUNTRY_DATA,
	UPDATE_GEOGRAPHIES_COUNTRY,
} from "../../graphql/Geographies/GeographyCountry";

function getInitialValues(props: GeographiesProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };

	return {
		name: "",
		code: "",
		// description: "",
		// organization: props.organization,
	};
}

function Geographies(props: GeographiesProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	let initialValues: IGeographies = getInitialValues(props);
	const [createGeographiesCountry, { loading: creatingGeographiesCountry }] = useMutation(
		CREATE_GEOGRAPHIES_COUNTRY,
		{
			refetchQueries: [{ query: GET_COUNTRY_COUNT }],
		}
	);

	console.log("creatingGeographiesCountry", creatingGeographiesCountry);

	const [updateGeographiesCountry, { loading: updatingGeographiesCountry }] = useMutation(
		UPDATE_GEOGRAPHIES_COUNTRY,
		{
			refetchQueries: [{ query: GET_COUNTRY_DATA }],
		}
	);

	const [deleteGeographiesCountry] = useMutation(DELETE_GEOGRAPHIES_COUNTRY, {
		refetchQueries: [{ query: GET_COUNTRY_DATA }],
	});

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	const onCreate = async (value: IGeographies) => {
		try {
			await createGeographiesCountry({
				variables: { input: { data: value } },
				refetchQueries: [
					{
						query: GET_COUNTRY_DATA,
						// variables: { filter: { organization: value.organization } },
					},
				],
				update: async (store, { data: createGeographiesCountry }) => {
					try {
						const count = await store.readQuery<{ geographiesCountryCount: number }>({
							query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ geographiesCountryCount: number }>({
							query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								geographiesCountryCount:
									(count && count.geographiesCountryCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.geographiesCountryCount;
						}
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
									createGeographiesCountry,
									...geographiesCountries,
								],
							},
						});
					} catch (err) {}
				},
			});
			notificationDispatch(setSuccessNotification("Geographies Country created !"));
			onCancel();
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error?.message));
		}
	};

	const onUpdate = async (value: IGeographies) => {
		// console.log("Update", value);
		const updateValue = {
			code: value.code,
			name: value.name,
		};
		// console.log("Update Value", updateValue);
		// console.log("Update ID", value.id);
		try {
			const id = value.id;
			delete value.id;
			await updateGeographiesCountry({
				variables: {
					input: {
						where: {
							id: id,
						},
						data: updateValue,
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
		let errors: Partial<IGeographies> = {};
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
						id: "geographiesCountryFormTitle",
						defaultMessage: "Geographies Country",
						description: `This text will be show on geographies country form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "geographiesCountryFormSubtitle",
					defaultMessage: "Manage Country Data",
					description: `This text will be show on geographies country form for subtitle`,
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
			{creatingGeographiesCountry || updatingGeographiesCountry ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default Geographies;
