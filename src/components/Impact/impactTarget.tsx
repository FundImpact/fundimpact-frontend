import React, { useEffect, useState } from "react";
import { IImpactTarget, ImpactTargetProps } from "../../models/impact/impactTarget";
import { FullScreenLoader } from "../Loader/Loader";
import { IMPACT_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { GET_IMPACT_CATEGORY_UNIT } from "../../graphql/queries/Impact/categoryUnit";
import { CREATE_IMPACT_TARGET } from "../../graphql/queries/Impact/target";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GET_IMPACT_CATEGORY } from "../../graphql/queries/Impact/category";
import { GET_IMPACT_TARGET_BY_PROJECT } from "../../graphql/queries/Impact/target";
import { impactTargetForm } from "../../utils/inputFields.json";

function getInitialValues(props: ImpactTargetProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Impact TARGET",
		description: "This is a sample Impact TARGET",
		target_value: "",
		impactCategory: "",
		impactUnit: "",
		impact_category_unit: "",
		project: props.project,
	};
}
function ImpactTarget(props: ImpactTargetProps) {
	const notificationDispatch = useNotificationDispatch();
	const { data: categories } = useQuery(GET_IMPACT_CATEGORY);
	const [currCategoryId, setCurrentCategoryId] = React.useState<number>();

	const [getUnitsAndCategory, { data: unitAndcategory }] = useLazyQuery(GET_IMPACT_CATEGORY_UNIT); //for fetching category_unit id
	const [getUnitsByCategory, { data: unitByCategory }] = useLazyQuery(GET_IMPACT_CATEGORY_UNIT); // for fetching units by category

	const [impactTarget, setImpactTarget] = useState<IImpactTarget>();
	const [createImpactTarget, { data: impact, loading: impactLoading }] = useMutation(
		CREATE_IMPACT_TARGET
	);

	// updating categories field with fetched categories list
	useEffect(() => {
		if (categories) {
			impactTargetForm[2].optionsArray = categories.impactCategoryOrgList;
			impactTargetForm[2].getInputValue = setCurrentCategoryId;
		}
	}, [categories]);

	// handling category change
	useEffect(() => {
		if (currCategoryId) {
			try {
				getUnitsByCategory({
					variables: { filter: { impact_category_org: currCategoryId } },
				});
			} catch (error) {
				notificationDispatch(setErrorNotification("Categories fetching failed !"));
			}
		}
	}, [currCategoryId]);

	// updating units field with fetched units list
	useEffect(() => {
		if (unitByCategory) {
			let arr: any = [];
			unitByCategory.impactCategoryUnitList.forEach(
				(elem: { impact_units_org: { id: number; name: string } }) => {
					arr.push({
						id: elem.impact_units_org.id,
						name: elem.impact_units_org.name,
					});
				}
			);
			impactTargetForm[3].optionsArray = arr;
		}
	}, [unitByCategory]);

	useEffect(() => {
		if (unitAndcategory) {
			// successfully fetched impact_category_unit_id
			let createInputTarget = {
				...impactTarget,
				impact_category_unit: unitAndcategory.impactCategoryUnitList[0].id,
			};
			try {
				createImpactTarget({
					variables: {
						input: createInputTarget,
					},
					refetchQueries: [
						{
							query: GET_IMPACT_TARGET_BY_PROJECT,
							variables: { filter: { project: props.project } },
						},
					],
				});
			} catch (error) {
				notificationDispatch(setErrorNotification("Impact Target creation Failed !"));
			}
		}
	}, [unitAndcategory]);

	useEffect(() => {
		if (impact) {
			notificationDispatch(setSuccessNotification("Impact Target Successfully created !"));
			props.handleClose();
		}
	}, [impact]);

	let initialValues: IImpactTarget = getInitialValues(props);

	const onCreate = (value: IImpactTarget) => {
		// fetch impact_category_unit_id
		setImpactTarget({
			name: value.name,
			target_value: Number(value.target_value),
			description: value.description,
			project: value.project,
			impact_category_unit: -1,
		});

		try {
			getUnitsAndCategory({
				variables: {
					filter: {
						impact_category_org: value.impactCategory,
						impact_units_org: value.impactUnit,
					},
				},
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Target creation Failed !"));
		}
	};

	const onUpdate = (value: IImpactTarget) => {};

	const clearErrors = (values: IImpactTarget) => {};

	const validate = (values: IImpactTarget) => {
		let errors: Partial<IImpactTarget> = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.project) {
			errors.project = "Project is required";
		}
		if (!values.target_value) {
			errors.target_value = "Target value is required";
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

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	return (
		<React.Fragment>
			<FormDialog
				title={"New Impact Target"}
				subtitle={"Physical addresses of your organisation like headquarter branch etc"}
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
						inputFields: impactTargetForm,
					}}
				/>
			</FormDialog>
			{impactLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default ImpactTarget;
