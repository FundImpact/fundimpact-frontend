import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import {
	CREATE_IMPACT_UNITS_ORG_INPUT,
	CREATE_IMPACT_CATEGORY_UNIT,
} from "../../../graphql/Impact/mutation";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import { impactUnitForm, impactUnitSelect } from "../inputField.json";
import { IInputField } from "../../../models";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";
import { useDashBoardData } from "../../../contexts/dashboardContext";

let inputFields: IInputField[] = impactUnitForm;

const initialValues: IImpactUnitFormInput = {
	name: "",
	description: "",
	code: "",
	target_unit: "",
	prefix_label: "",
	suffix_label: "",
	impactCategory: "",
};

const validate = (values: IImpactUnitFormInput) => {
	let errors: Partial<IImpactUnitFormInput> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.description) {
		errors.description = "Description is required";
	}
	if (!values.code) {
		errors.code = "Impact Code is required";
	}
	if (!values.target_unit) {
		errors.target_unit = "Target unit is required";
	}
	if (!values.prefix_label) {
		errors.prefix_label = "Prefix label is required";
	}
	if (!values.suffix_label) {
		errors.suffix_label = "Suffix label is required";
	}
	return errors;
};

function ImpactUnitDialog({ open, handleClose }: { open: boolean; handleClose: () => void }) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const [impactCategory, setImpactCategory] = useState<string>();

	const { data: impactCategories } = useQuery(GET_IMPACT_CATEGORY_BY_ORG, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});
	const [createImpactCategoryUnit] = useMutation(CREATE_IMPACT_CATEGORY_UNIT);

	const [createImpactUnitsOrgInput, { loading }] = useMutation(CREATE_IMPACT_UNITS_ORG_INPUT, {
		onCompleted(data) {
			console.log(data.createImpactUnitsOrgInput);
			createImpactCategoryUnit({
				variables: {
					input: {
						impact_category_org: impactCategory,
						impact_units_org: data.createImpactUnitsOrgInput?.id,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Impact Unit Creation Success"));
			handleClose();
		},
		onError() {
			notificationDispatch(setErrorNotification("Impact Unit Creation Failure"));
			handleClose();
		},
	});
	useEffect(() => {
		if (impactCategories) {
			impactUnitSelect[0].optionsArray = impactCategories.impactCategoryOrgList;
		}
	}, [impactCategories]);

	const onSubmit = async (values: IImpactUnitFormInput) => {
		setImpactCategory(values.impactCategory);
		delete values.impactCategory;

		createImpactUnitsOrgInput({
			variables: {
				input: {
					...values,
				},
			},
		});
	};

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={loading}
			title="New Impact Unit"
			subtitle="Physical addresses of your organizatin like headquater, branch etc."
			workspace={dashboardData?.workspace?.name}
			project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
		>
			<CommonForm
				initialValues={initialValues}
				validate={validate}
				onSubmit={onSubmit}
				onCancel={handleClose}
				inputFields={inputFields}
				selectFields={impactUnitSelect}
			/>
		</FormDialog>
	);
}

export default ImpactUnitDialog;
