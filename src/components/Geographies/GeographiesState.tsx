import {
	useMutation,
	// useQuery,
	// ApolloCache,
	// useLazyQuery,
	// FetchResult,
	// MutationFunctionOptions,
} from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import {
	IDeliverableUnit,
	DeliverableUnitProps,
	IDeliverableUnitData,
} from "../../models/deliverable/deliverableUnit";
import { useNotificationDispatch } from "../../contexts/notificationContext";
// import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
// import {
// 	CREATE_CATEGORY_UNIT,
// 	GET_DELIVERABLE_CATEGORY_UNIT_COUNT,
// 	GET_CATEGORY_UNIT,
// 	UPDATE_DELIVERABLE_CATEGPRY_UNIT,
// } from "../../graphql/Deliverable/categoryUnit";
import {
	CREATE_DELIVERABLE_UNIT,
	UPDATE_DELIVERABLE_UNIT_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { GEOGRAPHIES_ACTIONS } from "./constants";
// import { DELIVERABLE_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GeographiesStateForm } from "./inputField.json";
import {
	IGetDeliverablUnit,
	// IGetDeliverableCategoryUnit,
	// IGetDeliverableCategoryUnitVariables,
	// IUpdateDeliverableCategoryUnit,
	// IUpdateDeliverableCategoryUnitVariables,
} from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
// import Deliverable from "./Deliverable";
// import { useLocation } from "react-router";
import DeleteModal from "../DeleteModal";
import { DIALOG_TYPE } from "../../models/constants";
import {
	GoegraphiesStateProps,
	IGeographiesState,
} from "../../models/geographies/geographiesState";

function getInitialValues(props: GoegraphiesStateProps) {
	// function getInitialValues(props: DeliverableUnitProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	// if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		description: "",
		unit_type: "",
		prefix_label: "",
		suffix_label: "",
		organization: props.organization,
	};
}

interface IError extends Omit<Partial<IGeographiesState>, "GeographiesState"> {
	// interface IError extends Omit<Partial<IDeliverableUnit>, "deliverableCategory"> {
	deliverableCategory?: string;
}

function GeographiesState(props: GoegraphiesStateProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [createUnit, { loading: createUnitLoading }] = useMutation(CREATE_DELIVERABLE_UNIT, {
		onCompleted(data) {
			// createCategoryUnitHelper(data.createDeliverableUnitOrg.id); // deliverable unit id
		},
	});

	const [updateDeliverableUnit, { loading: updatingDeliverableUnit }] = useMutation(
		UPDATE_DELIVERABLE_UNIT_ORG,
		{
			onCompleted(data) {
				// createCategoryUnitHelper(data.updateDeliverableUnitOrg.id); // deliverable unit id
			},
		}
	);

	let initialValues: IGeographiesState = getInitialValues(props);
	// let initialValues: IDeliverableUnit = getInitialValues(props);
	const onCreate = async (valueSubmitted: IGeographiesState) => {
		// const onCreate = async (valueSubmitted: IDeliverableUnit) => {
		const value = Object.assign({}, valueSubmitted);
		// setDeliverableCategory(value.deliverableCategory || []);
		// delete value.deliverableCategory;
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
				refetchQueries: [
					{
						query: GET_DELIVERABLE_UNIT_BY_ORG,
						variables: { filter: { organization: dashboardData?.organization?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Deliverable Unit creation Success !"));
		} catch (error) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const onUpdate = async (value: IDeliverableUnit) => {
		try {
			const submittedValue = Object.assign({}, value);
			const id = submittedValue.id;
			// let submittedDeliverableCategory: string[] = submittedValue?.deliverableCategory || [];
			// const newDeliverableCategories = getNewDeliverableCategories({
			// 	deliverableCategories: submittedDeliverableCategory,
			// 	oldDeliverableCategories:
			// 		deliverableCategoryUnitList?.deliverableCategoryUnitList?.map(
			// 			(
			// 				deliverableCategoryUnit: IGetDeliverableCategoryUnit["deliverableCategoryUnitList"][0]
			// 			) => deliverableCategoryUnit.deliverable_category_org.id
			// 		) || [],
			// });
			// setDeliverableCategory(newDeliverableCategories);

			delete submittedValue.id;
			// delete submittedValue.deliverableCategory;
			await updateDeliverableUnit({
				variables: {
					id,
					input: submittedValue,
				},
			});
			// //remove newDeliverableCategories
			// await changeDeliverableCategoryUnitStatus({
			// 	updateDeliverableCategoryUnit,
			// 	deliverableCategoryUnitList:
			// 		deliverableCategoryUnitList?.deliverableCategoryUnitList || [],
			// 	submittedDeliverableCategory,
			// });
			notificationDispatch(setSuccessNotification("Deliverable Unit updation created !"));
			onCancel();
		} catch (err) {
			notificationDispatch(setErrorNotification(err?.message));
			onCancel();
		}
	};

	const validate = (values: IDeliverableUnit) => {
		let errors: IError = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
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
			// delete deliverableUnitValues["deliverableCategory"];
			await updateDeliverableUnit({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...deliverableUnitValues,
					},
				},
				refetchQueries: [
					{
						query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
						variables: {
							filter: {
								organization: dashboardData?.organization?.id,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Deliverable Unit Delete Success"));
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
				title="Delete Deliverable Unit test"
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
						defaultMessage: "Geographies State",
						description: `This text will be show on deliverable unit form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableUnitFormSubtitle",
					defaultMessage: "Manage Geographies State data here",
					description: `This text will be show on deliverable unit form for subtitle`,
				})}
				workspace={""}
				project={""}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createUnitLoading || updatingDeliverableUnit}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: GeographiesStateForm,
					}}
				/>
				{/* {openDeliverableCategoryDialog && (
					<Deliverable
						type={DELIVERABLE_ACTIONS.CREATE}
						open={openDeliverableCategoryDialog}
						handleClose={() => setOpenDeliverableCategoryDialog(false)}
						organization={dashboardData?.organization?.id}
					/>
				)} */}
			</FormDialog>
		</React.Fragment>
	);
}

export default GeographiesState;
