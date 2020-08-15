import React, { useEffect, useState } from "react";
import { IImpactTarget, ImpactTargetProps } from "../../models/impact/impactTarget";
import Snackbar from "../Snackbar/Snackbar";
import ImpactTargetForm from "../Forms/Impact/impactTarget";
import { FullScreenLoader } from "../Loader/Loader";
import { IMPACT_ACTIONS } from "./constants";
import { GET_IMPACT_CATEGORY_UNIT } from "../../graphql/queries/Impact/categoryUnit";
import { CREATE_IMPACT_TARGET } from "../../graphql/queries/Impact/target";
import { useMutation, useLazyQuery } from "@apollo/client";

function getInitialValues(props: ImpactTargetProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Impact TARGET",
		description: "This is a sample Impact TARGET",
		target_value: "",
		impactCategory: "",
		impactUnit: "",
		impact_category_unit: "",
		project: 4,
	};
}
function ImpactTarget(props: ImpactTargetProps) {
	const [getUnitsByCategory, { data: unitAndcategory, error }] = useLazyQuery(
		GET_IMPACT_CATEGORY_UNIT
	);

	const [impactTarget, setImpactTarget] = useState<IImpactTarget>();
	const [successMessage, setSuccessmessage] = useState<string>();
	const [
		createImpactTarget,
		{ data: impact, loading: impactLoading, error: impactError },
	] = useMutation(CREATE_IMPACT_TARGET);

	useEffect(() => {
		if (unitAndcategory) {
			// successfully fetched impact_category_unit_id
			console.log("here", {
				...impactTarget,
				impact_category_unit: unitAndcategory.impactCategoryUnitList[0].id,
			});
			let createInputTarget = {
				...impactTarget,
				impact_category_unit: unitAndcategory.impactCategoryUnitList[0].id,
			};
			createImpactTarget({
				variables: {
					input: createInputTarget,
				},
			});
		}
	}, [unitAndcategory]);

	useEffect(() => {
		if (impact) {
			setSuccessmessage("Impact Target Successfully created !");
			props.handleClose();
		}
	}, [impact]);

	let initialValues: IImpactTarget = getInitialValues(props);

	const onCreate = (value: IImpactTarget) => {
		console.log(`on Created is called with: `, value);
		// fetch impact_category_unit_id
		setImpactTarget({
			name: value.name,
			target_value: Number(value.target_value),
			description: value.description,
			project: value.project,
			impact_category_unit: -1,
		});

		getUnitsByCategory({
			variables: {
				filter: {
					impact_category_org: value.impactCategory,
					impact_units_org: value.impactUnit,
				},
			},
		});
		console.log("seeting loading to true");
	};

	const onUpdate = (value: IImpactTarget) => {
		console.log(`on Update is called`);
		console.log("seeting loading to true");
	};

	const clearErrors = (values: IImpactTarget) => {
		console.log(`Clear Errors is called`);
	};

	const validate = (values: IImpactTarget) => {
		let errors: Partial<IImpactTarget> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.project) {
			errors.project = "Project is required";
		}
		if (!values.impactCategory) {
			errors.impactCategory = "impact Category is required";
		}
		if (!values.impactUnit) {
			errors.impactUnit = "impact Unit is required";
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
			<ImpactTargetForm
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
			></ImpactTargetForm>
			{impactLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default ImpactTarget;
