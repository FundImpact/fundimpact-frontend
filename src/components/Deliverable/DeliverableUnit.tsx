import {
	useMutation,
	useQuery,
	ApolloCache,
	useLazyQuery,
	FetchResult,
	MutationFunctionOptions,
} from "@apollo/client";
import React, { useState, useEffect } from "react";

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
	UPDATE_DELIVERABLE_CATEGPRY_UNIT,
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
import {
	IGetDeliverablUnit,
	IGetDeliverableCategoryUnit,
	IGetDeliverableCategoryUnitVariables,
	IUpdateDeliverableCategoryUnit,
	IUpdateDeliverableCategoryUnitVariables,
} from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import Deliverable from "./Deliverable";
import { useLocation } from "react-router";
import DeleteModal from "../DeleteModal";
import { DIALOG_TYPE } from "../../models/constants";

interface IChangeDeliverableCategoryUnitStatusProps {
	updateDeliverableCategoryUnit: (
		options?:
			| MutationFunctionOptions<
					IUpdateDeliverableCategoryUnit,
					IUpdateDeliverableCategoryUnitVariables
			  >
			| undefined
	) => Promise<
		FetchResult<IUpdateDeliverableCategoryUnit, Record<string, any>, Record<any, any>>
	>;
	deliverableCategoryUnitList: IGetDeliverableCategoryUnit["deliverableCategoryUnitList"];
	submittedDeliverableCategory: string[];
}

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

const getNewDeliverableCategories = ({
	deliverableCategories,
	oldDeliverableCategories,
}: {
	deliverableCategories: string[];
	oldDeliverableCategories: string[];
}) =>
	deliverableCategories.filter(
		(element: string) => oldDeliverableCategories.indexOf(element) === -1
	) || [];

interface IError extends Omit<Partial<IDeliverableUnit>, "deliverableCategory"> {
	deliverableCategory?: string;
}

const changeDeliverableCategoryUnitStatus = async ({
	updateDeliverableCategoryUnit,
	deliverableCategoryUnitList,
	submittedDeliverableCategory,
}: IChangeDeliverableCategoryUnitStatusProps) => {
	const deliverableCategoryHash = submittedDeliverableCategory.reduce(
		(delCatHash: { [key: string]: boolean }, deliverableCategoryUnit) => {
			delCatHash[deliverableCategoryUnit] = true;
			return delCatHash;
		},
		{}
	);

	//write comment
	return Promise.all(
		deliverableCategoryUnitList.map((deliverableCategoryUnit) => {
			if (deliverableCategoryUnit.deliverable_category_org.id in deliverableCategoryHash) {
				return updateDeliverableCategoryUnit({
					variables: {
						id: deliverableCategoryUnit.id,
						input: {
							status: true,
						},
					},
				});
			} else {
				return updateDeliverableCategoryUnit({
					variables: {
						id: deliverableCategoryUnit.id,
						input: {
							status: false,
						},
					},
				});
			}
		})
	);
};

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

	const [openDeliverableCategoryDialog, setOpenDeliverableCategoryDialog] = useState<boolean>();
	deliverableUnitForm[1].addNewClick = () => setOpenDeliverableCategoryDialog(true);

	const [getDeliverableCategoryUnit, { data: deliverableCategoryUnitList }] = useLazyQuery<
		IGetDeliverableCategoryUnit,
		IGetDeliverableCategoryUnitVariables
	>(GET_CATEGORY_UNIT, {
		fetchPolicy: "cache-only",
	});

	const [updateDeliverableCategoryUnit] = useMutation<
		IUpdateDeliverableCategoryUnit,
		IUpdateDeliverableCategoryUnitVariables
	>(UPDATE_DELIVERABLE_CATEGPRY_UNIT);

	useEffect(() => {
		if (props.type === DELIVERABLE_ACTIONS.UPDATE && props.data.id) {
			getDeliverableCategoryUnit({
				variables: {
					filter: {
						deliverable_units_org: `${props.data.id}`,
					},
				},
			});
		}
	}, [getDeliverableCategoryUnit, props]);

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
			let submittedDeliverableCategory: string[] = submittedValue?.deliverableCategory || [];
			const newDeliverableCategories = getNewDeliverableCategories({
				deliverableCategories: submittedDeliverableCategory,
				oldDeliverableCategories:
					deliverableCategoryUnitList?.deliverableCategoryUnitList?.map(
						(
							deliverableCategoryUnit: IGetDeliverableCategoryUnit["deliverableCategoryUnitList"][0]
						) => deliverableCategoryUnit.deliverable_category_org.id
					) || [],
			});
			setDeliverableCategory(newDeliverableCategories);

			delete submittedValue.id;
			delete submittedValue.deliverableCategory;
			await updateDeliverableUnit({
				variables: {
					id,
					input: submittedValue,
				},
			});
			//remove newDeliverableCategories
			await changeDeliverableCategoryUnitStatus({
				updateDeliverableCategoryUnit,
				deliverableCategoryUnitList:
					deliverableCategoryUnitList?.deliverableCategoryUnitList || [],
				submittedDeliverableCategory,
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

	const onDelete = async () => {
		try {
			const deliverableUnitValues = { ...initialValues };
			delete deliverableUnitValues["id"];
			delete deliverableUnitValues["deliverableCategory"];
			await updateDeliverableUnit({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...deliverableUnitValues,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Budget Category Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	const intl = useIntl();
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				handleClose={onCancel}
				onDeleteConformation={onDelete}
				open={props.open}
				title="Delete Deliverable Unit"
			/>
		);
	}
	return (
		<React.Fragment>
			<FormDialog
				title={
					newOrEdit +
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
				workspace={""}
				project={""}
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
				{openDeliverableCategoryDialog && (
					<Deliverable
						type={DELIVERABLE_ACTIONS.CREATE}
						open={openDeliverableCategoryDialog}
						handleClose={() => setOpenDeliverableCategoryDialog(false)}
						organization={dashboardData?.organization?.id}
					/>
				)}
			</FormDialog>
			{/* {createUnitLoading || updatingDeliverableUnit || creatingCategoryUnit ? (
				<FullScreenLoader />
			) : null} */}
		</React.Fragment>
	);
}

export default DeliverableUnit;
