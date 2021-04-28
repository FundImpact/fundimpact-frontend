import React, { useEffect, useState } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	useMutation,
	useQuery,
	ApolloCache,
	FetchResult,
	MutationFunctionOptions,
	useLazyQuery,
} from "@apollo/client";
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
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import {
	IGetImpactUnit,
	IGetImpactCategoryUnit,
	IUpdateImpactCategoryUnit,
	IUpdateImpactCategoryUnitVariables,
	IGetImpactCategoryUnitVariables,
} from "../../../models/impact/query";
import {
	GET_IMPACT_CATEGORY_UNIT_COUNT,
	GET_IMPACT_CATEGORY_UNIT,
	UPDATE_IMPACT_CATEGORY_UNIT,
} from "../../../graphql/Impact/categoryUnit";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../../utils/commonFormattedMessage";
import ImpactCategoryDialog from "../ImpactCategoryDialog";
import { useLocation } from "react-router";
import DeleteModal from "../../DeleteModal";

let inputFields: any[] = impactUnitForm;

const defaultValues: IImpactUnitFormInput = {
	name: "",
	description: "",
	code: "",
	prefix_label: "",
	suffix_label: "",
	impactCategory: [],
};

interface IChangeImpactCategoryUnitStatusProps {
	updateImpactCategoryUnit: (
		options?:
			| MutationFunctionOptions<IUpdateImpactCategoryUnit, IUpdateImpactCategoryUnitVariables>
			| undefined
	) => Promise<FetchResult<IUpdateImpactCategoryUnit, Record<string, any>, Record<any, any>>>;
	impactCategoryUnitList: IGetImpactCategoryUnit["impactCategoryUnitList"];
	submittedImpactCategory: string[];
}

const changeImpactCategoryUnitStatus = async ({
	updateImpactCategoryUnit,
	impactCategoryUnitList,
	submittedImpactCategory,
}: IChangeImpactCategoryUnitStatusProps) => {
	const impactCategoryHash = submittedImpactCategory.reduce(
		(impCatHash: { [key: string]: boolean }, impactCategoryUnitList) => {
			impCatHash[impactCategoryUnitList] = true;
			return impCatHash;
		},
		{}
	);

	//write comment
	return Promise.all(
		impactCategoryUnitList.map((impactCategoryUnit) => {
			if (impactCategoryUnit.impact_category_org.id in impactCategoryHash) {
				return updateImpactCategoryUnit({
					variables: {
						id: impactCategoryUnit.id,
						input: {
							status: true,
						},
					},
				});
			} else {
				return updateImpactCategoryUnit({
					variables: {
						id: impactCategoryUnit.id,
						input: {
							status: false,
						},
					},
				});
			}
		})
	);
};

const getNewImpactCategories = ({
	impactCategories,
	oldImpactCategories,
}: {
	impactCategories: string[];
	oldImpactCategories: string[];
}) =>
	impactCategories.filter((element: string) => oldImpactCategories.indexOf(element) === -1) || [];

const validate = (values: IImpactUnitFormInput) => {
	let errors: Partial<IImpactUnitFormInput> = {};
	if (!values.name) {
		errors.name = "Name is required";
	}
	if (!values.impactCategory?.length) {
		errors.name = "Impact category is required";
	}
	return errors;
};

function ImpactUnitDialog({
	open,
	handleClose,
	formAction,
	initialValues: formValues,
	organization,
	dialogType,
}: IImpactUnitProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const [impactCategory, setImpactCategory] = useState<string[]>([]);
	const initialValues = formAction === FORM_ACTIONS.CREATE ? defaultValues : formValues;

	const [updateImpactCategoryUnit] = useMutation<
		IUpdateImpactCategoryUnit,
		IUpdateImpactCategoryUnitVariables
	>(UPDATE_IMPACT_CATEGORY_UNIT);

	const [getImpactCategoryUnitList, { data: impactCategoryUnitList }] = useLazyQuery<
		IGetImpactCategoryUnit,
		IGetImpactCategoryUnitVariables
	>(GET_IMPACT_CATEGORY_UNIT, {
		fetchPolicy: "cache-only",
	});
	useEffect(() => {
		if (formAction === FORM_ACTIONS.UPDATE && initialValues) {
			getImpactCategoryUnitList({
				variables: {
					filter: {
						impact_units_org: `${initialValues.id}`,
					},
				},
			});
		}
	}, [getImpactCategoryUnitList, initialValues]);

	const { data: impactCategories } = useQuery(GET_IMPACT_CATEGORY_BY_ORG, {
		variables: { filter: { organization: organization } },
	});
	const [createImpactCategoryUnit, { loading: creatingImpactCategoryUnit }] = useMutation(
		CREATE_IMPACT_CATEGORY_UNIT
	);
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	const [openImpactCategoryDialog, setOpenImpactCategoryDialog] = useState<boolean>();
	impactUnitForm[2].addNewClick = () => setOpenImpactCategoryDialog(true);

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
			console.error(err);
		}
	};

	const [createImpactUnitsOrgInput, { loading: creatingInpactUnit }] = useMutation(
		CREATE_IMPACT_UNITS_ORG_INPUT,
		{
			async onCompleted(data) {
				try {
					if (impactCategory) {
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
			onError(error) {
				notificationDispatch(setErrorNotification(error.message));
				handleClose();
			},
		}
	);

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
						organization: organization,
					},
				},
				update: async (store, { data: { createImpactUnitsOrgData } }) => {
					try {
						const count = await store.readQuery<{ impactUnitsOrgCount: number }>({
							query: GET_IMPACT_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: organization,
								},
							},
						});

						store.writeQuery<{ impactUnitsOrgCount: number }>({
							query: GET_IMPACT_UNIT_COUNT_BY_ORG,
							variables: {
								filter: {
									organization: organization,
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
									organization: organization,
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
									organization: organization,
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
									organization: organization,
								},
							},
						});

						let impactUnitList: IImpactUnitData[] =
							cachedData?.impactUnitsOrgList || [];

						store.writeQuery<IGetImpactUnit>({
							query: GET_IMPACT_UNIT_BY_ORG,
							variables: {
								filter: {
									organization: organization,
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
			let submittedImpactCategory: string[] = valuesSubmitted?.impactCategory || [];
			const newImpactCategories = getNewImpactCategories({
				impactCategories: submittedImpactCategory,
				oldImpactCategories:
					impactCategoryUnitList?.impactCategoryUnitList.map(
						(impactCategoryUnit: IGetImpactCategoryUnit["impactCategoryUnitList"][0]) =>
							impactCategoryUnit.impact_category_org.id
					) || [],
			});
			setImpactCategory(newImpactCategories);
			delete values.impactCategory;
			delete values.id;
			await updateImpactUnitsOrgInput({
				variables: {
					id: initialValues?.id,
					input: {
						name: valuesSubmitted.name,
						code: valuesSubmitted.code,
						description: valuesSubmitted.description,
						organization: dashboardData?.organization?.id,
					},
				},
			});
			//remove newImpactCategories
			await changeImpactCategoryUnitStatus({
				updateImpactCategoryUnit,
				impactCategoryUnitList: impactCategoryUnitList?.impactCategoryUnitList || [],
				submittedImpactCategory,
			});
		} catch (err) {}
	};

	const onDelete = async () => {
		try {
			const impactUnitValues = { ...initialValues };
			delete impactUnitValues["id"];
			await updateImpactUnitsOrgInput({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						name: initialValues?.name,
						code: initialValues?.code,
						description: initialValues?.description,
						organization: dashboardData?.organization?.id,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Impact Unit Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			handleClose();
		}
	};

	const intl = useIntl();

	if (dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				open={open}
				handleClose={handleClose}
				onDeleteConformation={onDelete}
				title="Delete Impact Unit"
			/>
		);
	}

	return (
		<FormDialog
			handleClose={handleClose}
			open={open}
			loading={creatingInpactUnit || updatingImpactUnit || creatingImpactCategoryUnit}
			title={
				newOrEdit +
				" " +
				intl.formatMessage({
					id: "impactUnitFormTitle",
					defaultMessage: "Impact Unit",
					description: `This text will be show on impact unit form for title`,
				})
			}
			subtitle={intl.formatMessage({
				id: "impactUnitFormSubtitle",
				defaultMessage:
					"Physical addresses of your organization like headquater, branch etc.",
				description: `This text will be show on impact unit form for subtitle`,
			})}
			workspace={""}
			project={""}
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
			{openImpactCategoryDialog && (
				<ImpactCategoryDialog
					formAction={FORM_ACTIONS.CREATE}
					open={openImpactCategoryDialog}
					handleClose={() => setOpenImpactCategoryDialog(false)}
					organization={dashboardData?.organization?.id}
				/>
			)}
		</FormDialog>
	);
}

export default ImpactUnitDialog;
