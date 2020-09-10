import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../../contexts/notificationContext";
import {
	CREATE_IMPACT_CATEGORY_UNIT,


	CREATE_IMPACT_UNITS_ORG_INPUT,
} from "../../../graphql/Impact/mutation";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { IInputField } from "../../../models";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
	UPDATE_IMPACT_UNIT_ORG,
} from "../../../graphql/Impact/mutation";
import {
	GET_IMPACT_UNIT_BY_ORG,
	GET_IMPACT_CATEGORY_BY_ORG,
	GET_IMPACT_UNIT_COUNT_BY_ORG,
} from "../../../graphql/Impact/query";
import { useNotificationDispatch } from "../../../contexts/notificationContext";



import {
	setErrorNotification,
	setSuccessNotification,
} from "../../../reducers/notificationReducer";
import FormDialog from "../../FormDialog";
import CommonForm from "../../Forms/CommonForm";


import { impactUnitForm, impactUnitSelect } from "../inputField.json";
import { impactUnitForm } from "./inputFields.json";
import { IInputField } from "../../../models";
import FormDialog from "../../FormDialog";
import CommonForm from "../../CommonForm/commonForm";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IImpactUnitProps, IImpactUnitData } from "../../../models/impact/impact";
import { FORM_ACTIONS } from "../../../models/constants";
import { IGetImpactUnit } from "../../../models/impact/query";
import { GET_IMPACT_CATEGORY_UNIT_COUNT } from "../../../graphql/Impact/categoryUnit";

let inputFields: IInputField[] = impactUnitForm;

const defaultValues: IImpactUnitFormInput = {
	name: "",
	description: "",
	code: "",
	target_unit: "",
	prefix_label: "",
	suffix_label: "",
	impactCategory: [],
};

const validate = (values: IImpactUnitFormInput) => {
	let errors: Partial<IImpactUnitFormInput> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.target_unit) {
		errors.target_unit = "Target unit is required";
	}
	return errors;
};

function ImpactUnitDialog({
	open,
	handleClose,
	formAction,
	initialValues: formValues,
}: IImpactUnitProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const [impactCategory, setImpactCategory] = useState<string[]>([]);

	const { data: impactCategories } = useQuery(GET_IMPACT_CATEGORY_BY_ORG, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});
	const [createImpactCategoryUnit, { loading: creatingImpactCategoryUnitI }] = useMutation(
		CREATE_IMPACT_CATEGORY_UNIT
	);

	const impactCategoryUnitHelper = async (impactUnitId: string) => {
		try {
			console.log("here", impactCategory);
			for (let i = 0; i < impactCategory.length; i++) {
				await createImpactCategoryUnit({
					variables: {
						input: {
							impact_category_org: impactCategory[i],
							impact_units_org: impactUnitId,
						},
					},
				});
			}
		} catch (err) {
			console.log("err :>> ", err);
		}
	};

	const [createImpactUnitsOrgInput, { loading: creatingInpactUnit }] = useMutation(
		CREATE_IMPACT_UNITS_ORG_INPUT,
		{
			async onCompleted(data) {
				if (impactCategory) {
					await impactCategoryUnitHelper(data.createImpactUnitsOrgInput?.id);
				}
				notificationDispatch(setSuccessNotification("Impact Unit Creation Success"));
				handleClose();
			},
			onError() {
				notificationDispatch(setErrorNotification("Impact Unit Creation Failure"));
				handleClose();
			},
		}
	);

	const [updateImpactUnitsOrgInput, { loading: updatingImpactUnit }] = useMutation(
		UPDATE_IMPACT_UNIT_ORG,
		{
			async onCompleted(data) {
				if (impactCategory) {
					await impactCategoryUnitHelper(data.updateImpactUnitsOrgInput?.id);
				}
				notificationDispatch(setSuccessNotification("Impact Unit Updation Success"));
				handleClose();
			},
			onError() {
				notificationDispatch(setErrorNotification("Impact Unit Updation Failure"));
				handleClose();
			},
		}
	);

	const initialValues = formAction == FORM_ACTIONS.CREATE ? defaultValues : formValues;
	useEffect(() => {
		if (impactCategories) {
			impactUnitForm[6].optionsArray = impactCategories?.impactCategoryOrgList;
		}
	}, [impactCategories]);

	const onSubmit = async (valuesSubmitted: IImpactUnitFormInput) => {
		try {
			const values = Object.assign({}, valuesSubmitted);
			setImpactCategory(values.impactCategory);
			delete values.impactCategory;
			await createImpactUnitsOrgInput({
				variables: {
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
				update: async (store, { data: { createImpactUnitsOrgInput } }) => {
					try {
						const count = await store.readQuery<{ impactUnitsOrgCount: number }>({
							query: GET_IMPACT_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ impactUnitsOrgCount: number }>({
							query: GET_IMPACT_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								impactUnitsOrgCount: count!.impactUnitsOrgCount + 1,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.impactUnitsOrgCount;
						}
						const dataRead = await store.readQuery<IGetImpactUnit>({
							query: GET_IMPACT_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let impactUnits: IImpactUnitData[] = dataRead?.impactUnitsOrgList
							? dataRead?.impactUnitsOrgList
							: [];

						store.writeQuery<IGetImpactUnit>({
							query: GET_IMPACT_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								impactUnitsOrgList: [createImpactUnitsOrgInput, ...impactUnits],
							},
						});

						const cachedData = store.readQuery<IGetImpactUnit>({
							query: GET_IMPACT_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						let impactUnitList: IImpactUnitData[] =
							cachedData?.impactUnitsOrgList || [];

						store.writeQuery<IGetImpactUnit>({
							query: GET_IMPACT_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								impactUnitsOrgList: [createImpactUnitsOrgInput, ...impactUnitList],
							},
						});
					} catch (err) {}
				},
			});
		} catch (err) {}
	};

	const onUpdate = async (valuesSubmitted: IImpactUnitFormInput) => {
		try {
			const values = Object.assign({}, valuesSubmitted);
			setImpactCategory(
				values?.impactCategory?.filter(
					(element: string) => initialValues?.impactCategory?.indexOf(element) == -1
				) || []
			);
			delete values.impactCategory;
			delete values.id;
			await updateImpactUnitsOrgInput({
				variables: {
					id: initialValues?.id,
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
			});
		} catch (err) {}
	};

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={creatingInpactUnit || updatingImpactUnit || creatingImpactCategoryUnitI}
			title="Impact Unit"
			subtitle="Physical addresses of your organizatin like headquater, branch etc."
			workspace={dashboardData?.workspace?.name}
			project={dashboardData?.project?.name ? dashboardData?.project?.name : ""}
		>
			<CommonForm
				initialValues={initialValues}
				validate={validate}
				onCreate={onSubmit}
				onCancel={handleClose}
				inputFields={inputFields}
				onUpdate={onUpdate}
				formAction={formAction}
			/>
		</FormDialog>
	);
}

export default ImpactUnitDialog;
