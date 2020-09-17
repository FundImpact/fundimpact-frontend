import { useMutation, useQuery, ApolloCache } from "@apollo/client";
import React, { useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import {
	IDeliverableUnit,
	DeliverableUnitProps,
	IDeliverableUnitData,
} from "../../models/deliverable/deliverableUnit";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	CREATE_CATEGORY_UNIT,
	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
	GET_CATEGORY_UNIT,
} from "../../graphql/Deliverable/categoryUnit";
import {
	CREATE_DELIVERABLE_UNIT,
	UPDATE_DELIVERABLE_UNIT_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { DELIVERABLE_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { deliverableUnitForm } from "./inputField.json";
import { IGetDeliverablUnit, IGetDeliverableCategoryUnit } from "../../models/deliverable/query";
import { useIntl } from "react-intl";

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
		deliverableCategory: [],
	};
}

interface IError extends Omit<Partial<IDeliverableUnit>, "deliverableCategory"> {
	deliverableCategory?: string;
}

function DeliverableUnit(props: DeliverableUnitProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [deliverableCategory, setDeliverableCategory] = useState<string[]>([]);
	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});
	const [createCategoryUnit, { loading: creatingCategoryUnit }] = useMutation(
		CREATE_CATEGORY_UNIT
	);

	const updateDeliverableCategoryUnitCount = async (store: ApolloCache<any>, filter: object) => {
		try {
			const deliverableCategoryUnitCount = await store.readQuery<{
				deliverableCategoryUnitCount: number;
			}>({
				query: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
				variables: {
					filter,
				},
			});

			store.writeQuery<{ deliverableCategoryUnitCount: number }>({
				query: GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
				variables: {
					filter,
				},
				data: {
					deliverableCategoryUnitCount:
						(deliverableCategoryUnitCount &&
							deliverableCategoryUnitCount.deliverableCategoryUnitCount + 1) ||
						0,
				},
			});
			return deliverableCategoryUnitCount;
		} catch (err) {}
	};

	const updateDeliverableCategoryUnitList = async ({
		limit,
		filter,
		store,
		createdDeliverableCategoryUnit,
	}: {
		limit?: number;
		filter: object;
		store: ApolloCache<any>;
		createdDeliverableCategoryUnit: any;
	}) => {
		try {
			const variables = (limit && {
				filter,
				limit: limit > 10 ? 10 : limit,
				start: 0,
				sort: "created_at:DESC",
			}) || { filter };

			const deliverableCategoryUnitCacheByUnit = await store.readQuery<
				IGetDeliverableCategoryUnit
			>({
				query: GET_CATEGORY_UNIT,
				variables,
			});

			store.writeQuery<IGetDeliverableCategoryUnit>({
				query: GET_CATEGORY_UNIT,
				variables,
				data: {
					deliverableCategoryUnitList: [
						createdDeliverableCategoryUnit,
						...((deliverableCategoryUnitCacheByUnit &&
							deliverableCategoryUnitCacheByUnit.deliverableCategoryUnitList) ||
							[]),
					],
				},
			});
		} catch (err) {}
	};

	const createCategoryUnitHelper = async (deliverableUnitId: string) => {
		try {
			for (let i = 0; i < deliverableCategory.length; i++) {
				await createCategoryUnit({
					variables: {
						input: {
							deliverable_category_org: deliverableCategory[i],
							deliverable_units_org: deliverableUnitId,
						},
					},
					update: async (store, { data: createdDeliverableCategoryUnit }) => {
						const deliverableCategoryUnitByUnitCount = await updateDeliverableCategoryUnitCount(
							store,
							{
								deliverable_units_org: deliverableUnitId,
							}
						);

						const deliverableCategoryUnitByCategoryCount = await updateDeliverableCategoryUnitCount(
							store,
							{
								deliverable_category_org: deliverableCategory[i],
							}
						);

						let limit = 0;
						if (deliverableCategoryUnitByUnitCount) {
							limit = deliverableCategoryUnitByUnitCount.deliverableCategoryUnitCount;
						}

						await updateDeliverableCategoryUnitList({
							createdDeliverableCategoryUnit,
							limit,
							filter: { deliverable_units_org: deliverableUnitId },
							store,
						});

						if (deliverableCategoryUnitByCategoryCount) {
							limit =
								deliverableCategoryUnitByCategoryCount.deliverableCategoryUnitCount;
						}

						await updateDeliverableCategoryUnitList({
							createdDeliverableCategoryUnit,
							limit,
							filter: { deliverable_category_org: deliverableCategory[i] },
							store,
						});

						await updateDeliverableCategoryUnitList({
							createdDeliverableCategoryUnit,
							filter: { deliverable_units_org: deliverableUnitId },
							store,
						});
					},
				});
			}
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

	const [updateDeliverableUnit, { loading: updatingDeliverableUnit }] = useMutation(
		UPDATE_DELIVERABLE_UNIT_ORG,
		{
			onCompleted(data) {
				createCategoryUnitHelper(data.updateDeliverableUnitOrg.id); // deliverable unit id
			},
		}
	);

	// updating categories field with fetched categories list
	if (deliverableCategories) {
		deliverableUnitForm[1].optionsArray = deliverableCategories.deliverableCategory;
	}

	let initialValues: IDeliverableUnit = getInitialValues(props);
	const onCreate = async (valueSubmitted: IDeliverableUnit) => {
		const value = Object.assign({}, valueSubmitted);
		setDeliverableCategory(value.deliverableCategory || []);
		delete value.deliverableCategory;
		try {
			await createUnit({
				variables: { input: value },
				update: async (store, { data: createDeliverableUnitOrg }) => {
					try {
						const count = await store.readQuery<{ deliverableUnitOrgCount: number }>({
							query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
						});

						store.writeQuery<{ deliverableUnitOrgCount: number }>({
							query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
							},
							data: {
								deliverableUnitOrgCount:
									(count && count.deliverableUnitOrgCount + 1) || 0,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.deliverableUnitOrgCount;
						}
						const dataRead = await store.readQuery<IGetDeliverablUnit>({
							query: GET_DELIVERABLE_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let deliverableUnits: IDeliverableUnitData[] = dataRead?.deliverableUnitOrg
							? dataRead?.deliverableUnitOrg
							: [];

						store.writeQuery<IGetDeliverablUnit>({
							query: GET_DELIVERABLE_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: dashboardData?.organization?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								deliverableUnitOrg: [createDeliverableUnitOrg, ...deliverableUnits],
							},
						});
					} catch (err) {
						console.error(err);
					}
				},
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable Unit creation Failed !"));
		}
	};

	const onUpdate = async (value: IDeliverableUnit) => {
		try {
			const submittedValue = Object.assign({}, value);
			const id = submittedValue.id;
			setDeliverableCategory(
				submittedValue?.deliverableCategory?.filter(
					(element: string) => initialValues?.deliverableCategory?.indexOf(element) == -1
				) || []
			);
			delete submittedValue.id;
			delete submittedValue.deliverableCategory;
			await updateDeliverableUnit({
				variables: {
					id,
					input: submittedValue,
				},
			});
			notificationDispatch(setSuccessNotification("Deliverable Unit updation created !"));
			onCancel();
		} catch (err) {
			notificationDispatch(setErrorNotification("Deliverable Unit updation Failed !"));
			onCancel();
		}
	};

	const validate = (values: IDeliverableUnit) => {
		let errors: IError = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		if (!values.deliverableCategory?.length) {
			errors.deliverableCategory = "Deliverable Category is required";
		}
		if (!values.organization) {
			errors.organization = "Organization is required";
		}
		return errors;
	};
	const intl = useIntl();
	return (
		<React.Fragment>
			<FormDialog
				title={
					(formAction === DELIVERABLE_ACTIONS.CREATE
						? intl.formatMessage({
								id: "newFormHeading",
								defaultMessage: "New",
								description: `This text will be show on forms for New`,
						  })
						: intl.formatMessage({
								id: "editFormHeading",
								defaultMessage: "Edit",
								description: `This text will be show on forms for Edit`,
						  })) +
					" " +
					intl.formatMessage({
						id: "deliverableUnitFormTitle",
						defaultMessage: "Deliverable Unit",
						description: `This text will be show on deliverable unit form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableUnitFormSubtitle",
					defaultMessage:
						"Physical addresses of your organisation like headquarter branch etc",
					description: `This text will be show on deliverable unit form for subtitle`,
				})}
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createUnitLoading || updatingDeliverableUnit || creatingCategoryUnit}
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
			{/* {createUnitLoading || updatingDeliverableUnit || creatingCategoryUnit ? (
				<FullScreenLoader />
			) : null} */}
		</React.Fragment>
	);
}

export default DeliverableUnit;
