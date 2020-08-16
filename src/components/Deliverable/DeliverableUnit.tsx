import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { IDeliverableUnit, DeliverableUnitProps } from "../../models/deliverable/deliverableUnit";
import DeliverableUnitForm from "../Forms/Deliverable/DeliverableUnit";
import { FullScreenLoader } from "../Loader/Loader";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { CREATE_CATEGORY_UNIT } from "../../graphql/queries/Deliverable/categoryUnit";
import { CREATE_DELIVERABLE_UNIT } from "../../graphql/queries/Deliverable/unit";
import { DELIVERABLE_ACTIONS } from "./constants";

function getInitialValues(props: DeliverableUnitProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Test Deliverable",
		code: "",
		description: "This is a sample deliverable",
		unit_type: "",
		prefix_label: "XX",
		suffix_label: "YY",
		organization: 2,
	};
}
function DeliverableUnit(props: DeliverableUnitProps) {
	const [deliverableCategory, setDeliverableCategory] = useState<number>();
	const notificationDispatch = useNotificationDispatch();

	const [createUnit, { data: createUnitResponse, error: createUnitError }] = useMutation(
		CREATE_DELIVERABLE_UNIT
	);

	const [
		createCategoryUnit,
		{ data: createCategoryUnitResponse, error: createCategoryUnitError },
	] = useMutation(CREATE_CATEGORY_UNIT);

	useEffect(() => {
		if (createUnitResponse) {
			try {
				createCategoryUnit({
					variables: {
						input: {
							deliverable_category_org: deliverableCategory,
							deliverable_units_org: createUnitResponse.createDeliverableUnitOrg.id,
						},
					},
				});
			} catch (error) {
				notificationDispatch(setErrorNotification("Deliverable Unit creation Failed !"));
			}
		}
	}, [createUnitResponse]);

	useEffect(() => {
		if (createCategoryUnitResponse) {
			notificationDispatch(setSuccessNotification("Deliverable Unit Successfully created !"));
			props.handleClose();
		}
	}, [createCategoryUnitResponse]);

	let initialValues: IDeliverableUnit = getInitialValues(props);
	const onCreate = (value: IDeliverableUnit) => {
		setDeliverableCategory(Number(value.deliverableCategory));
		delete value.deliverableCategory;
		try {
			createUnit({ variables: { input: value } });
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable Unit creation Failed !"));
		}

		console.log(`on Created is called with: `, value);
		console.log("seeting loading to true");
	};

	const onUpdate = (value: IDeliverableUnit) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
	};

	const clearErrors = (values: IDeliverableUnit) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IDeliverableUnit) => {
		let errors: Partial<IDeliverableUnit> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.prefix_label) {
			errors.prefix_label = "prefix label is required";
		}
		if (!values.suffix_label) {
			errors.suffix_label = "Project is required";
		}
		if (!values.deliverableCategory) {
			errors.deliverableCategory = "Name is required";
		}
		if (!values.organization) {
			errors.organization = "Project is required";
		}
		return errors;
	};

	const formState = props.type;
	const formIsOpen = props.open;
	const handleFormOpen = props.handleClose;
	return (
		<React.Fragment>
			<DeliverableUnitForm
				{...{
					initialValues,
					formState,
					onCreate,
					onUpdate,
					clearErrors,
					validate,
					formIsOpen,
					handleFormOpen,
				}}
			>
				{/* {props.type === DELIVERABLE_ACTIONS.CREATE && createError ? (
					<Snackbar severity="error" msg={"Create Failed"} />
				) : null}
				{props.type === DELIVERABLE_ACTIONS.UPDATE && updateError ? (
					<Snackbar severity="error" msg={"Update Failed"} />
				) : null} */}
			</DeliverableUnitForm>
			{/* {response && response.createOrgProject && response.createOrgProject.name && (
				<Snackbar severity="success" msg={"Successfully created"} />
			)}
			{createLoading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null} */}
		</React.Fragment>
	);
}

export default DeliverableUnit;
