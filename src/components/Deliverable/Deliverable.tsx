import { useMutation } from "@apollo/client";
import React from "react";
import {
	IDeliverable,
	DeliverableProps,
	IDeliverableCategoryData,
} from "../../models/deliverable/deliverable";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
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
import { deliverableCategoryForm } from "./inputField.json";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { IGetDeliverableCategory } from "../../models/deliverable/query";
import { useIntl } from "react-intl";

function getInitialValues(props: DeliverableProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		description: "",
		organization: props.organization,
	};
}

function Deliverable(props: DeliverableProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	let initialValues: IDeliverable = getInitialValues(props);
	const [createDeliverableCategory, { loading: creatingDeliverableCategory }] = useMutation(
		CREATE_DELIVERABLE_CATEGORY
	);
	const [updateDeliverableCategory, { loading: updatingDeliverableCategory }] = useMutation(
		UPDATE_DELIVERABLE_CATEGORY
	);
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const onCreate = async (value: IDeliverable) => {
		try {
			await createDeliverableCategory({
				variables: { input: value },
				refetchQueries: [
					{
						query: GET_DELIVERABLE_ORG_CATEGORY,
						variables: { filter: { organization: value.organization } },
					},
				],
				update: async (store, { data: createDeliverableCategoryData }) => {
					try {
						const count = await store.readQuery<{ deliverableCategoryCount: number }>({
							query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ deliverableCategoryCount: number }>({
							query: GET_DELIVERABLE_CATEGORY_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								deliverableCategoryCount:
									(count && count.deliverableCategoryCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.deliverableCategoryCount;
						}
						const dataRead = await store.readQuery<IGetDeliverableCategory>({
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
						let deliverableCategories: IDeliverableCategoryData[] = dataRead?.deliverableCategory
							? dataRead?.deliverableCategory
							: [];

						store.writeQuery<IGetDeliverableCategory>({
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
								deliverableCategory: [
									createDeliverableCategoryData,
									...deliverableCategories,
								],
							},
						});
					} catch (err) {
						console.error(err);
					}
				},
			});
			notificationDispatch(setSuccessNotification("Deliverable category created !"));
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable category creation Failed !"));
		}
	};

	const onUpdate = async (value: IDeliverable) => {
		try {
			const submittedValue = Object.assign({}, value);
			const id = submittedValue.id;
			delete submittedValue.id;
			await updateDeliverableCategory({
				variables: {
					id,
					input: submittedValue,
				},
			});
			notificationDispatch(setSuccessNotification("Deliverable category updated !"));
			onCancel();
		} catch (err) {
			notificationDispatch(setErrorNotification("Deliverable category updation Failed !"));
			onCancel();
		}
	};

	const validate = (values: IDeliverable) => {
		let errors: Partial<IDeliverable> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.organization) {
			errors.organization = "Organization is required";
		}
		return errors;
	};
	const intl = useIntl();
	return (
		<React.Fragment>
			<FormDialog
				title={
					(formAction === DELIVERABLE_ACTIONS.CREATE
						? intl.formatMessage({
								id: "newFormHeading",
								defaultMessage: "New",
								description: `This text will be show on forms for New`,
						  })
						: intl.formatMessage({
								id: "editFormHeading",
								defaultMessage: "Edit",
								description: `This text will be show on forms for Edit`,
						  })) +
					" " +
					intl.formatMessage({
						id: "deliverableCategoryFormTitle",
						defaultMessage: "Deliverable Category",
						description: `This text will be show on deliverable category form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableCategoryFormSubtitle",
					defaultMessage: "Manage Deliverable Category",
					description: `This text will be show on deliverable category form for subtitle`,
				})}
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name}
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
						inputFields: deliverableCategoryForm,
					}}
				/>
			</FormDialog>
			{creatingDeliverableCategory || updatingDeliverableCategory ? (
				<FullScreenLoader />
			) : null}
		</React.Fragment>
	);
}

export default Deliverable;
