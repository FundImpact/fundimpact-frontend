import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { IDeliverableUnit, DeliverableUnitProps } from "../../models/deliverable/deliverableUnit";
import { FullScreenLoader } from "../Loader/Loader";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { CREATE_CATEGORY_UNIT } from "../../graphql/queries/Deliverable/categoryUnit";
import { CREATE_DELIVERABLE_UNIT } from "../../graphql/queries/Deliverable/unit";
import { DELIVERABLE_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/queries/Deliverable/category";
import CommonForm from "../CommonForm/commonForm";
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
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [deliverableCategory, setDeliverableCategory] = useState<number>();
	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY);
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
			deliverableUnitForm[2].optionsArray = deliverableCategories.deliverableCategory;
		}
	}, [deliverableCategories]);

	let initialValues: IDeliverableUnit = getInitialValues(props);

	const onCreate = async (value: IDeliverableUnit) => {
		setDeliverableCategory(Number(value.deliverableCategory));
		delete value.deliverableCategory;
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
		if (!values.prefix_label) {
			errors.prefix_label = "prefix Label is required";
		}
		if (!values.suffix_label) {
			errors.suffix_label = "Suffix Label is required";
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
				title={"New Deliverable Unit"}
				subtitle={"create a new deliverable unit"}
				workspace={"workspace"}
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
