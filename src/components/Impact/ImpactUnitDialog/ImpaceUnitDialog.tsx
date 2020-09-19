import React, { useEffect, useState } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useMutation, useQuery, ApolloCache } from "@apollo/client";
import {
	CREATE_IMPACT_CATEGORY_UNIT,
	CREATE_IMPACT_UNITS_ORG_INPUT,
} from "../../../graphql/Impact/mutation";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import { UPDATE_IMPACT_UNIT_ORG } from "../../../graphql/Impact/mutation";
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
import { impactUnitForm } from "./inputFields.json";
import FormDialog from "../../FormDialog";
import CommonForm from "../../CommonForm/commonForm";
import { IImpactUnitProps, IImpactUnitData } from "../../../models/impact/impact";
import { FORM_ACTIONS } from "../../../models/constants";
import { IGetImpactUnit, IGetImpactCategoryUnit } from "../../../models/impact/query";
import {
	GET_IMPACT_CATEGORY_UNIT_COUNT,
	GET_IMPACT_CATEGORY_UNIT,
} from "../../../graphql/Impact/categoryUnit";

let inputFields: any[] = impactUnitForm;

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
	const [createImpactCategoryUnit, { loading: creatingImpactCategoryUnit }] = useMutation(
		CREATE_IMPACT_CATEGORY_UNIT
	);

	const updateImpactCategoryUnitCount = async (
		store: ApolloCache<any>,
		filter: { [key: string]: string }
	) => {
		try {
			const impactCategoryUnitCount = await store.readQuery<{
				impactCategoryUnitListCount: number;
			}>({
				query: GET_IMPACT_CATEGORY_UNIT_COUNT,
				variables: {
					filter,
				},
			});

			store.writeQuery<{ impactCategoryUnitListCount: number }>({
				query: GET_IMPACT_CATEGORY_UNIT_COUNT,
				variables: {
					filter,
				},
				data: {
					impactCategoryUnitListCount:
						(impactCategoryUnitCount &&
							impactCategoryUnitCount.impactCategoryUnitListCount + 1) ||
						0,
				},
			});
			return impactCategoryUnitCount;
		} catch (err) {}
	};

	const updateImpactCategoryUnitList = async ({
		limit,
		filter,
		store,
		createdImpactCategoryUnit,
	}: {
		limit?: number;
		filter: { [key: string]: string };
		store: ApolloCache<any>;
		createdImpactCategoryUnit: any;
	}) => {
		try {
			const variables = (limit && {
				filter,
				limit: limit > 10 ? 10 : limit,
				start: 0,
				sort: "created_at:DESC",
			}) || { filter };

			const impactCategoryUnitCacheByUnit = await store.readQuery<IGetImpactCategoryUnit>({
				query: GET_IMPACT_CATEGORY_UNIT,
				variables,
			});

			store.writeQuery<IGetImpactCategoryUnit>({
				query: GET_IMPACT_CATEGORY_UNIT,
				variables,
				data: {
					impactCategoryUnitList: [
						createdImpactCategoryUnit,
						...((impactCategoryUnitCacheByUnit &&
							impactCategoryUnitCacheByUnit.impactCategoryUnitList) ||
							[]),
					],
				},
			});
		} catch (err) {
			console.error(err);
		}
	};

	const impactCategoryUnitHelper = async (impactUnitId: string) => {
		try {
			for (let i = 0; i < impactCategory.length; i++) {
				await createImpactCategoryUnit({
					variables: {
						input: {
							impact_category_org: impactCategory[i],
							impact_units_org: impactUnitId,
						},
					},
					refetchQueries: [],
					update: async (store, { data: createdImpactCategoryUnit }) => {
						const impactCategoryUnitByUnitCount = await updateImpactCategoryUnitCount(
							store,
							{
								impact_units_org: impactUnitId,
							}
						);

						const impactCategoryUnitByCategoryCount = await updateImpactCategoryUnitCount(
							store,
							{
								impact_category_org: impactCategory[i],
							}
						);

						let limit = 0;
						if (impactCategoryUnitByUnitCount) {
							limit = impactCategoryUnitByUnitCount.impactCategoryUnitListCount;
						}

						await updateImpactCategoryUnitList({
							createdImpactCategoryUnit,
							limit,
							filter: { impact_units_org: impactUnitId },
							store,
						});

						if (impactCategoryUnitByCategoryCount) {
							limit = impactCategoryUnitByCategoryCount.impactCategoryUnitListCount;
						}

						await updateImpactCategoryUnitList({
							createdImpactCategoryUnit,
							limit,
							filter: { impact_category_org: impactCategory[i] },
							store,
						});

						await updateImpactCategoryUnitList({
							createdImpactCategoryUnit,
							filter: { impact_units_org: impactUnitId },
							store,
						});
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
				try {
					if (impactCategory) {
						console.log("data :>> ", data);
						await impactCategoryUnitHelper(data.createImpactUnitsOrgInput?.id);
					}
					notificationDispatch(setSuccessNotification("Impact Unit Creation Success"));
				} catch (err) {
				} finally {
					handleClose();
				}
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
			impactUnitForm[2].optionsArray = impactCategories?.impactCategoryOrgList;
		}
	}, [impactCategories]);

	const onSubmit = async (valuesSubmitted: IImpactUnitFormInput) => {
		try {
			const values = Object.assign({}, valuesSubmitted);
			setImpactCategory(values?.impactCategory || []);
			delete values.prefix_label;
			delete values.suffix_label;
			delete values.impactCategory;
			await createImpactUnitsOrgInput({
				variables: {
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
				update: async (store, { data: { createImpactUnitsOrgData } }) => {
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
								impactUnitsOrgCount: (count && count.impactUnitsOrgCount + 1) || 0,
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
								impactUnitsOrgList: [createImpactUnitsOrgData, ...impactUnits],
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
								impactUnitsOrgList: [createImpactUnitsOrgData, ...impactUnitList],
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
			loading={creatingInpactUnit || updatingImpactUnit || creatingImpactCategoryUnit}
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
