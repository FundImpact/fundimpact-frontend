import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";
import { CREATE_CATEGORY_UNIT } from "../../graphql/Deliverable/categoryUnit";
import { CREATE_DELIVERABLE_UNIT } from "../../graphql/Deliverable/unit";
import { DeliverableUnitProps, IDeliverableUnit } from "../../models/deliverable/deliverableUnit";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { deliverableUnitForm } from "./inputField.json";

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
	};
}

function DeliverableUnit(props: DeliverableUnitProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [deliverableCategory, setDeliverableCategory] = useState<number>();
	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});
	const [createCategoryUnit] = useMutation(CREATE_CATEGORY_UNIT);

	const createCategoryUnitHelper = async (deliverableUnitId: string) => {
		try {
			await createCategoryUnit({
				variables: {
					input: {
						deliverable_category_org: deliverableCategory,
						deliverable_units_org: deliverableUnitId,
					},
				},
			});
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
	// updating categories field with fetched categories list
	useEffect(() => {
		if (deliverableCategories) {
			deliverableUnitForm[1].optionsArray = deliverableCategories.deliverableCategory;
		}
	}, [deliverableCategories]);

	let initialValues: IDeliverableUnit = getInitialValues(props);

	const onCreate = async (value: IDeliverableUnit) => {
		setDeliverableCategory(Number(value.deliverableCategory));
		delete (value as any).deliverableCategory;
		try {
			await createUnit({ variables: { input: value } });
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable Unit creation Failed !"));
		}
	};

	const onUpdate = (value: IDeliverableUnit) => {};

	const validate = (values: IDeliverableUnit) => {
		let errors: Partial<IDeliverableUnit> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.deliverableCategory) {
			errors.deliverableCategory = "Category is required";
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
			{createUnitLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default DeliverableUnit;
