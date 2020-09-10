import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";




import { useDashBoardData } from "../../contexts/dashboardContext";
import { IDeliverableUnit, DeliverableUnitProps, IDeliverableUnitData } from "../../models/deliverable/deliverableUnit";
import {
	IDeliverableUnit,
	DeliverableUnitProps,
	IDeliverableUnitData,
} from "../../models/deliverable/deliverableUnit";
import { FullScreenLoader } from "../Loader/Loader";


import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";
import { CREATE_CATEGORY_UNIT } from "../../graphql/Deliverable/categoryUnit";


import { CREATE_DELIVERABLE_UNIT } from "../../graphql/Deliverable/unit";
import { DeliverableUnitProps, IDeliverableUnit } from "../../models/deliverable/deliverableUnit";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	CREATE_DELIVERABLE_UNIT,
	UPDATE_DELIVERABLE_UNIT_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { DELIVERABLE_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";


import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { deliverableUnitForm } from "./inputField.json";


import { useDashBoardData } from "../../contexts/dashboardContext";
import { IGetDeliverablUnit } from "../../models/deliverable/query";
import { IDeliverableCategoryData, IDeliverable } from "../../models/deliverable/deliverable";

function getInitialValues(props: DeliverableUnitProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		description: "",
		unit_type: "",
		prefix_label: "",
		suffix_label: "",
		organization: props.organization,
		deliverableCategory: [],
	};
}

interface IError extends Omit<Partial<IDeliverableUnit>, "deliverableCategory"> {
	deliverableCategory?: string;
}

function DeliverableUnit(props: DeliverableUnitProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [deliverableCategory, setDeliverableCategory] = useState<IDeliverable[]>([]);
	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});
	const [createCategoryUnit, { loading: creatingCategoryUnit }] = useMutation(
		CREATE_CATEGORY_UNIT
	);

	const createCategoryUnitHelper = async (deliverableUnitId: string) => {
		try {
			for (let i = 0; i < deliverableCategory.length; i++) {
				await createCategoryUnit({
					variables: {
						input: {
							deliverable_category_org: deliverableCategory[i].id,
							deliverable_units_org: deliverableUnitId,
						},
					},
				});
			}
			notificationDispatch(setSuccessNotification("Deliverable unit created successfully !"));
			onCancel();
		} catch (error) {
			notificationDispatch(
				setErrorNotification("Deliverable unit linked to category Failed !")
			);
		}
	};

	const [createUnit, { loading: createUnitLoading }] = useMutation(CREATE_DELIVERABLE_UNIT, {
		onCompleted(data) {
			createCategoryUnitHelper(data.createDeliverableUnitOrg.id); // deliverable unit id
		},
	});

	const [updateDeliverableUnit, { loading: updatingDeliverableUnit }] = useMutation(
		UPDATE_DELIVERABLE_UNIT_ORG,
		{
			onCompleted(data) {
				createCategoryUnitHelper(data.updateDeliverableUnitOrg.id); // deliverable unit id
			},
		}
	);

	// updating categories field with fetched categories list
	if (deliverableCategories) {
		deliverableUnitForm[1].optionsArray = deliverableCategories.deliverableCategory;
	}

	let initialValues: IDeliverableUnit = getInitialValues(props);
	const onCreate = async (valueSubmitted: IDeliverableUnit) => {
		const value = Object.assign({}, valueSubmitted);
		setDeliverableCategory(value.deliverableCategory || []);
		delete value.deliverableCategory;
		try {
			await createUnit({
				variables: { input: value },
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
								deliverableUnitOrgCount: count!.deliverableUnitOrgCount + 1,
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
						let deliverableUnits: IDeliverableUnitData[] = dataRead?.deliverableUnitOrg
							? dataRead?.deliverableUnitOrg
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
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable Unit creation Failed !"));
		}
	};

	const onUpdate = async (value: IDeliverableUnit) => {
		try {
			const submittedValue = Object.assign({}, value);
			const id = submittedValue.id;
			setDeliverableCategory(
				submittedValue?.deliverableCategory?.filter(
					(element: IDeliverable) =>
						initialValues?.deliverableCategory?.indexOf(element) == -1
				) || []
			);
			delete submittedValue.id;
			delete submittedValue.deliverableCategory;
			await updateDeliverableUnit({
				variables: {
					id,
					input: submittedValue,
				},
			});
			notificationDispatch(setSuccessNotification("Deliverable Unit updation created !"));
			onCancel();
		} catch (err) {
			notificationDispatch(setErrorNotification("Deliverable Unit updation Failed !"));
			onCancel();
		}
	};

	const validate = (values: IDeliverableUnit) => {
		let errors: IError = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.deliverableCategory?.length) {
			errors.deliverableCategory = "Deliverable Category is required";
		}
		if (!values.organization) {
			errors.organization = "Organization is required";
		}
		return errors;
	};

	return (
		<React.Fragment>
			<FormDialog
				title={
					(formAction === DELIVERABLE_ACTIONS.CREATE ? "New" : "Edit") + " Target unit"
				}
				subtitle={"Physical addresses of your organisation like headquarter branch etc"}
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
						inputFields: deliverableUnitForm,
					}}
				/>
			</FormDialog>
			{createUnitLoading || updatingDeliverableUnit || creatingCategoryUnit ? (
				<FullScreenLoader />
			) : null}
		</React.Fragment>
	);
}

export default DeliverableUnit;
