import { useMutation, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
	IDeliverableTarget,
	DeliverableTargetProps,
} from "../../models/deliverable/deliverableTarget";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import DeliverableTargetForm from "../Forms/Deliverable/DeliverableTarget";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { CREATE_DELIVERABLE_TARGET } from "../../graphql/queries/Deliverable/target";
import { GET_CATEGORY_UNIT } from "../../graphql/queries/Deliverable/categoryUnit";
function getInitialValues(props: DeliverableTargetProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Test Deliverable Target",
		description: "This is a sample deliverable",
		target_value: "",
		deliverableCategory: "",
		deliverableUnit: "",
		deliverable_category_unit: -1,
		project: 4,
	};
}
function DeliverableTarget(props: DeliverableTargetProps) {
	const notificationDispatch = useNotificationDispatch();
	const [getCategoryUnit, { data: categoryUnit }] = useLazyQuery(GET_CATEGORY_UNIT);

	const [deliverbaleTarget, setDeliverableTarget] = useState<IDeliverableTarget>();
	const [
		createDeliverableTarget,
		{ data: createDeliverableTargetRes, loading: createDeliverableTargetLoading },
	] = useMutation(CREATE_DELIVERABLE_TARGET);

	useEffect(() => {
		if (categoryUnit) {
			// successfully fetched impact_category_unit_id
			let createInputTarget = {
				...deliverbaleTarget,
				deliverable_category_unit: categoryUnit.deliverableCategoryUnitList[0].id,
			};
			try {
				createDeliverableTarget({
					variables: {
						input: createInputTarget,
					},
				});
			} catch (error) {
				notificationDispatch(setErrorNotification("Deliverable Target creation Failed !"));
			}

			console.log("categoryUnit", categoryUnit);
		}
	}, [categoryUnit]);

	useEffect(() => {
		if (createDeliverableTargetRes) {
			notificationDispatch(
				setSuccessNotification("Deliverable Target Successfully created !")
			);
			console.log("createDeliverableTargetRes", createDeliverableTargetRes);
			props.handleClose();
		}
	}, [createDeliverableTargetRes]);

	let initialValues: IDeliverableTarget = getInitialValues(props);
	const onCreate = (value: IDeliverableTarget) => {
		console.log(`on Created is called with: `, value);
		setDeliverableTarget({
			name: value.name,
			target_value: Number(value.target_value),
			description: value.description,
			project: value.project,
			deliverable_category_unit: -1,
		});
		try {
			getCategoryUnit({
				variables: {
					filter: {
						deliverable_category_org: value.deliverableCategory,
						deliverable_units_org: value.deliverableUnit,
					},
				},
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable Target creation Failed !"));
		}

		console.log("seeting loading to true");
	};

	const onUpdate = (value: IDeliverableTarget) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
	};

	const clearErrors = (values: IDeliverableTarget) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IDeliverableTarget) => {
		let errors: Partial<IDeliverableTarget> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.project) {
			errors.project = "Project is required";
		}
		if (!values.deliverableCategory) {
			errors.deliverableCategory = "Deliverable Category is required";
		}
		if (!values.deliverableUnit) {
			errors.deliverableUnit = "Deliverable Unit is required";
		}
		if (!values.target_value) {
			errors.name = "Target value is required";
		}
		return errors;
	};

	const formState = props.type;
	const formIsOpen = props.open;
	const handleFormOpen = props.handleClose;
	return (
		<React.Fragment>
			<DeliverableTargetForm
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
			></DeliverableTargetForm>
		</React.Fragment>
	);
}

export default DeliverableTarget;
