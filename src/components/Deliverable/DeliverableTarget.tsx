import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import {
	GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
	GET_DELIVERABLE_ORG_CATEGORY,
} from "../../graphql/Deliverable/category";
import { GET_CATEGORY_UNIT } from "../../graphql/Deliverable/categoryUnit";
import {
	CREATE_DELIVERABLE_TARGET,
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	GET_DELIVERABLE_TARGETS_COUNT,
	UPDATE_DELIVERABLE_TARGET,
} from "../../graphql/Deliverable/target";
import {
	DeliverableTargetProps,
	IDeliverableTarget,
} from "../../models/deliverable/deliverableTarget";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { deliverableTargetForm } from "./inputField.json";
import {
	IGET_DELIVERABLE_TARGET_BY_PROJECT,
	IDeliverableTargetByProjectResponse,
} from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import {
	GET_ALL_DELIVERABLES_SPEND_AMOUNT,
	GET_ALL_DELIVERABLES_TARGET_AMOUNT,
} from "../../graphql/project";
import Deliverable from "./Deliverable";
import DeliverableUnit from "./DeliverableUnit";
import { DIALOG_TYPE } from "../../models/constants";
import DeleteModal from "../DeleteModal";
import {
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_PROJECT_COUNT,
} from "../../graphql/Deliverable/unit";

function getInitialValues(props: DeliverableTargetProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		description: "",
		target_value: 0,
		deliverable_unit_org: "",
		deliverable_category_org: "",
		project: props.project,
	};
}
function DeliverableTarget(props: DeliverableTargetProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const [getUnitsByOrg, { data: unitsByOrg }] = useLazyQuery(GET_DELIVERABLE_UNIT_BY_ORG); // for fetching units by category

	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});

	// const [currentCategory, setcurrentCategory] = useState<any>();
	// const [deliverbaleTarget, setDeliverableTarget] = useState<IDeliverableTarget>();

	const [createDeliverableTarget, { loading: createDeliverableTargetLoading }] = useMutation(
		CREATE_DELIVERABLE_TARGET
	);

	const [updateDeliverableTarget, { loading: updateDeliverableTargetLoading }] = useMutation(
		UPDATE_DELIVERABLE_TARGET
	);

	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const formAction = props.type;
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);

	const [openDeliverableCategoryDialog, setOpenDeliverableCategoryDialog] = useState<boolean>();
	deliverableTargetForm[2].addNewClick = () => setOpenDeliverableCategoryDialog(true);

	const [openDeliverableUnitDialog, setOpenDeliverableUnitDialog] = useState<boolean>();
	deliverableTargetForm[3].addNewClick = () => setOpenDeliverableUnitDialog(true);

	const createDeliverableTargetHelper = async (deliverableTarget: IDeliverableTarget) => {
		try {
			let createInputTarget = {
				...deliverableTarget,
				// deliverable_category_unit: deliverableCategoryUnitId,
			};
			delete (createInputTarget as any).id;
			await createDeliverableTarget({
				variables: {
					input: createInputTarget,
				},
				update: async (store, { data: { createDeliverableTarget: targetCreated } }) => {
					try {
						const count = await store.readQuery<{ deliverableTargetCount: number }>({
							query: GET_DELIVERABLE_TARGETS_COUNT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
						});

						store.writeQuery<{ deliverableTargetCount: number }>({
							query: GET_DELIVERABLE_TARGETS_COUNT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
							data: {
								deliverableTargetCount: count!.deliverableTargetCount + 1,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.deliverableTargetCount;
						}
						const dataRead = await store.readQuery<IGET_DELIVERABLE_TARGET_BY_PROJECT>({
							query: GET_DELIVERABLE_TARGET_BY_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let deliverableTargets: IDeliverableTargetByProjectResponse[] = dataRead?.deliverableTargetList
							? dataRead?.deliverableTargetList
							: [];
						store.writeQuery<IGET_DELIVERABLE_TARGET_BY_PROJECT>({
							query: GET_DELIVERABLE_TARGET_BY_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								deliverableTargetList: [...deliverableTargets, targetCreated],
							},
						});

						store.writeQuery<IGET_DELIVERABLE_TARGET_BY_PROJECT>({
							query: GET_DELIVERABLE_TARGET_BY_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
							data: {
								deliverableTargetList: [...deliverableTargets, targetCreated],
							},
						});
					} catch (err) {
						console.error(err);
					}
				},
				refetchQueries: [
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: { filter: { project: props.project } },
					},
					{
						query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
						variables: { filter: { project: props.project } },
					},
				],
			});
			// setcurrentCategory("");
			notificationDispatch(
				setSuccessNotification("Deliverable Target created successfully !")
			);
		} catch (error) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const updateDeliverableTargetHelper = async (deliverableTarget: IDeliverableTarget) => {
		let createInputTarget: any = {
			...deliverableTarget,
			// deliverable_category_unit: deliverableCategoryUnitId,
		};
		let deliverableId = createInputTarget.id;
		delete (createInputTarget as any).id;
		try {
			await updateDeliverableTarget({
				variables: {
					id: deliverableId,
					input: createInputTarget,
				},
				refetchQueries: [
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: {
							limit: 10,
							start: 0,
							sort: "created_at:DESC",
							filter: { project: props.project },
						},
					},
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: { filter: { project: props.project } },
					},
					{
						query: GET_ACHIEVED_VALLUE_BY_TARGET,
						variables: {
							filter: { deliverableTargetProject: deliverableId },
						},
					},
					{
						query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
						variables: { filter: { project: props.project } },
					},
				],
			});
			notificationDispatch(
				setSuccessNotification("Deliverable Target updated successfully !")
			);
			// setcurrentCategory("");
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification(error?.message));
		}
	};
	//  fetching category_unit id and on completion creating deliverable target
	// const [getCategoryUnit] = useLazyQuery(GET_CATEGORY_UNIT, {
	// 	onCompleted(data) {
	// 		if (!data?.deliverableCategoryUnitList) return;
	// 		if (!data.deliverableCategoryUnitList.length) {
	// 			notificationDispatch(setErrorNotification("Unit not match with category !"));
	// 			return;
	// 		}

	// 		if (props.type === DELIVERABLE_ACTIONS.CREATE)
	// 			createDeliverableTargetHelper(data.deliverableCategoryUnitList[0].id);
	// 		//deliverable_category_unit id
	// 		else updateDeliverableTargetHelper(data.deliverableCategoryUnitList[0].id);
	// 	},
	// 	onError(err) {
	// 		notificationDispatch(setErrorNotification("Unit not match with category !"));
	// 	},
	// 	fetchPolicy: "network-only",
	// });

	// useEffect(() => {
	// 	if (props.type === DELIVERABLE_ACTIONS.UPDATE) {
	// 		setcurrentCategory(props.data?.deliverableCategory);
	// 	}
	// }, [props.type]);
	// updating categories field with fetched categories list
	useEffect(() => {
		if (deliverableCategories) {
			deliverableTargetForm[2].optionsArray = deliverableCategories.deliverableCategory;
			// deliverableTargetForm[2].getInputValue = setcurrentCategory;
		}
	}, [deliverableCategories]);

	useEffect(() => {
		if (unitsByOrg) {
			deliverableTargetForm[3].optionsArray = unitsByOrg.deliverableUnitOrg;
			// deliverableTargetForm[2].getInputValue = setcurrentCategory;
		}
	}, [unitsByOrg]);

	// handling category change
	useEffect(() => {
		if (dashboardData?.organization?.id) {
			getUnitsByOrg({
				variables: { filter: { organization: dashboardData?.organization?.id } },
			});
		}
	}, [dashboardData, getUnitsByOrg]);

	let initialValues: IDeliverableTarget = getInitialValues(props);
	const onCreate = async (value: IDeliverableTarget) => {
		await createDeliverableTargetHelper({
			id: value.id,
			name: value.name,
			target_value: Number(value.target_value),
			description: value.description,
			project: value.project,
			deliverable_category_org: value?.deliverable_category_org,
			deliverable_unit_org: value?.deliverable_unit_org,
		});
		// fetching deliverable_category_unit before creating deliverable Target
		// getCategoryUnit({
		// 	variables: {
		// 		filter: {
		// 			deliverable_category_org: value.deliverableCategory,
		// 			deliverable_units_org: value.deliverableUnit,
		// 		},
		// 	},
		// });
	};

	const onUpdate = async (value: IDeliverableTarget) => {
		// onCreate(value);
		await updateDeliverableTargetHelper(value);
	};

	const validate = (values: IDeliverableTarget) => {
		let errors: Partial<any> = {};
		if (props.type === DELIVERABLE_ACTIONS.CREATE) {
			if (!values.name && !values.name.length) {
				errors.name = "Name is required";
			}
			if (!values.project) {
				errors.project = "Project is required";
			}
			if (!values.target_value) {
				errors.target_value = "Target value is required";
			}
			if (!values.deliverable_category_org) {
				errors.deliverable_category_org = "Deliverable Category is required";
			}
			if (!values.deliverable_unit_org) {
				errors.deliverable_unit_org = "Deliverable Unit is required";
			}
		}

		if (props.type === DELIVERABLE_ACTIONS.UPDATE) {
			if (!values.name && !values.name.length) {
				errors.name = "Name is required";
			}
			if (!values.project) {
				errors.project = "Project is required";
			}
			if (!values.target_value) {
				errors.target_value = "Target value is required";
			}
		}
		return errors;
	};
	const intl = useIntl();
	const onDelete = async () => {
		try {
			const deliverableTargetValues = { ...initialValues };
			delete deliverableTargetValues["id"];
			await updateDeliverableTarget({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...deliverableTargetValues,
					},
				},
				refetchQueries: [
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_ACHIEVED_VALLUE_BY_TARGET,
						variables: {
							filter: { deliverableTargetProject: initialValues.id },
						},
					},
					{
						query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_DELIVERABLE_TARGETS_COUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
						variables: {
							filter: {
								deliverable_category_org:
									deliverableTargetValues?.deliverable_category_org,
							},
						},
					},
					{
						query: GET_DELIVERABLE_UNIT_PROJECT_COUNT,
						variables: {
							filter: {
								deliverable_unit_org: deliverableTargetValues?.deliverable_unit_org,
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Deliverable Target Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				handleClose={onCancel}
				open={props.open}
				title="Delete Deliverable Target"
				onDeleteConformation={onDelete}
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
						id: "deliverableTargetFormTitle",
						defaultMessage: "Deliverable Target",
						description: `This text will be show on deliverable target form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableTargetFormSubtitle",
					defaultMessage:
						"Physical addresses of your organisation like headquarter branch etc",
					description: `This text will be show on deliverable target form for subtitle`,
				})}
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate: onCreate,
						onCancel,
						formAction,
						onUpdate: onUpdate,
						inputFields: deliverableTargetForm,
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
				{openDeliverableUnitDialog && (
					<DeliverableUnit
						type={DELIVERABLE_ACTIONS.CREATE}
						open={openDeliverableUnitDialog}
						handleClose={() => setOpenDeliverableUnitDialog(false)}
						organization={dashboardData?.organization?.id}
					/>
				)}
			</FormDialog>
			{createDeliverableTargetLoading ? <FullScreenLoader /> : null}
			{updateDeliverableTargetLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default DeliverableTarget;
