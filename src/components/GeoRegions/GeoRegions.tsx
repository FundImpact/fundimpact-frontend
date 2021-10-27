import { useMutation } from "@apollo/client";
import React from "react";
import { useIntl } from "react-intl";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import {
	GET_ORG_BUDGET_CATEGORY_COUNT,
	GET_ORGANIZATION_BUDGET_CATEGORY,
} from "../../graphql/Budget";
import {
	CREATE_ORG_BUDGET_CATEGORY,
	UPDATE_ORG_BUDGET_CATEGORY,
} from "../../graphql/Budget/mutation";
import { IInputField } from "../../models";
import { IBudgetCategory, IBudgetCategoryProps } from "../../models/budget";
import { IGET_BUDGET_CATEGORY } from "../../models/budget/query";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../models/constants";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { compareObjectKeys, removeEmptyKeys } from "../../utils";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import FormDialog from "../FormDialog";
import CommonForm from "../CommonForm";
import { GeoRegionsFormInputFields } from "./inputFields.json";
import DeleteModal from "../DeleteModal";
import { IGeoRegions, IGeoRegionsProps } from "../../models/GeoRegions";
import { CREATE_GEOREGIONS } from "../../graphql/GeoRegions/query";

let inputFields: IInputField[] = GeoRegionsFormInputFields;
// let inputFields: IInputField[] = budgetCategoryFormInputFields;

let defaultFormValues: IGeoRegions = {
	name: "",
	code: "",
	description: "",
};

const validate = (values: IGeoRegions) => {
	let errors: Partial<IGeoRegions> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	return errors;
};

function GeoRegions({
	open,
	handleClose,
	initialValues: formValues,
	formAction,
	getCreatedGeoRegions,
	dialogType,
}: IGeoRegionsProps) {
	const [createNewOrgGeoRegions, { loading: creatingGeoRegions }] = useMutation(
		CREATE_GEOREGIONS
		// CREATE_ORG_BUDGET_CATEGORY
	);
	const [updateGeoRegions, { loading: updatingGeoRegions }] = useMutation(
		UPDATE_ORG_BUDGET_CATEGORY
	);
	// const [createNewOrgBudgetCategory, { loading: creatingBudgetCategory }] = useMutation(
	// 	CREATE_ORG_BUDGET_CATEGORY
	// );
	// const [updateBudgetCategory, { loading: updatingBudgetCategory }] = useMutation(
	// 	UPDATE_ORG_BUDGET_CATEGORY
	// );

	const notificationDispatch = useNotificationDispatch();

	const dashboardData = useDashBoardData();

	let initialValues = formAction === FORM_ACTIONS.CREATE ? defaultFormValues : formValues;

	const onSubmit = async (valuesSubmitted: IGeoRegions) => {
		let values = removeEmptyKeys<IGeoRegions>({ objectToCheck: valuesSubmitted });
		try {
			await createNewOrgGeoRegions({
				variables: {
					input: { data: values },
					// input: { ...values, organization: dashboardData?.organization?.id },
				},
				update: async (store, { data: { createOrgGeoRegions } }) => {
					// update: async (store, { data: { createOrgBudgetCategory } }) => {
					try {
						if (getCreatedGeoRegions) {
							getCreatedGeoRegions(createOrgGeoRegions);
						}
						// if (getCreatedBudgetCategory) {
						// 	getCreatedBudgetCategory(createOrgBudgetCategory);
						// }

						const count = await store.readQuery<{ orgGeoRegionsCount: number }>({
							// const count = await store.readQuery<{ orgBudgetCategoryCount: number }>({
							query: GET_ORG_BUDGET_CATEGORY_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ orgGeoRegionsCount: number }>({
							query: GET_ORG_BUDGET_CATEGORY_COUNT,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgGeoRegionsCount: (count && count.orgGeoRegionsCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.orgGeoRegionsCount;
						}
						const dataRead = await store.readQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let geoRegions: Partial<IGeoRegions>[] = dataRead?.orgBudgetCategory
							? // let budgetCategories: Partial<IGeoRegions>[] = dataRead?.orgBudgetCategory
							  dataRead?.orgBudgetCategory
							: [];

						store.writeQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								orgBudgetCategory: [createOrgGeoRegions, ...geoRegions],
								// orgBudgetCategory: [createOrgBudgetCategory, ...budgetCategories],
							},
						});
					} catch (err) {
						// console.error(err);
					}

					try {
						const data = store.readQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});
						let geoRegion: Partial<IGeoRegions>[] = data?.orgBudgetCategory
							? // let budgetCategory: Partial<IGeoRegions>[] = data?.orgBudgetCategory
							  data?.orgBudgetCategory
							: [];
						store.writeQuery<IGET_BUDGET_CATEGORY>({
							query: GET_ORGANIZATION_BUDGET_CATEGORY,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								orgBudgetCategory: [createOrgGeoRegions, ...geoRegion],
								// orgBudgetCategory: [createOrgBudgetCategory, ...budgetCategory],
							},
						});
					} catch (err) {
						// console.error(err);
					}
				},
			});
			notificationDispatch(setSuccessNotification("Geo Regions Creation Success"));
			handleClose();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			handleClose();
		}
	};

	const onUpdate = async (valuesSubmitted: IGeoRegions) => {
		try {
			let values = removeEmptyKeys<IGeoRegions>({
				objectToCheck: valuesSubmitted,
				keysToRemainUnchecked: {
					description: 1,
				},
			});

			if (compareObjectKeys(values, initialValues)) {
				handleClose();
				return;
			}
			delete values.id;

			await updateGeoRegions({
				variables: {
					id: initialValues?.id,
					input: {
						...values,
						organization: dashboardData?.organization?.id,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Geo Regions Updation Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
		} finally {
			handleClose();
		}
	};

	const onDelete = async () => {
		try {
			const budgetCategoryValues: any = { ...initialValues };
			delete budgetCategoryValues["id"];
			await updateGeoRegions({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...budgetCategoryValues,
						organization: dashboardData?.organization?.id,
					},
				},
				refetchQueries: [
					{
						query: GET_ORG_BUDGET_CATEGORY_COUNT,
						variables: {
							filter: {
								organization: dashboardData?.organization?.id,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Geo Regions Delete Success"));
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);

	const updateGeoRegionSubtitle = intl.formatMessage({
		id: "BudgetCategoryUpdateFormSubtitle",
		defaultMessage: "Update Geo Regions Of Organization",
		description: `This text will be show on update geo regions form`,
	});

	const createGeoRegionSubtitle = intl.formatMessage({
		id: "BudgetCategoryCreateFormSubtitle",
		defaultMessage: "Create New Geo Regions For Organization",
		description: `This text will be show on create geo regions form`,
	});

	if (dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={open}
				handleClose={handleClose}
				title="Geo Regions"
				onDeleteConformation={onDelete}
			/>
		);
	}

	return (
		<>
			<FormDialog
				handleClose={handleClose}
				open={open}
				loading={updatingGeoRegions || creatingGeoRegions}
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "geoRegionsFormTitle",
						defaultMessage: "Geo Regions",
						description: `This text will be show on Geo Regions form for title`,
					})
				}
				subtitle={
					formAction === FORM_ACTIONS.CREATE
						? createGeoRegionSubtitle
						: updateGeoRegionSubtitle
				}
				workspace={""}
				project={""}
			>
				<CommonForm
					initialValues={initialValues}
					validate={validate}
					onCreate={onSubmit}
					onCancel={handleClose}
					inputFields={inputFields}
					formAction={formAction}
					onUpdate={onUpdate}
				/>
			</FormDialog>
		</>
	);
}

export default GeoRegions;
