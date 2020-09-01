import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../graphql/Deliverable/category";
import { GET_CATEGORY_UNIT } from "../../graphql/Deliverable/categoryUnit";
import {
	CREATE_DELIVERABLE_TARGET,
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	UPDATE_DELIVERABLE_TARGET,
	GET_DELIVERABLE_TARGETS_COUNT,
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
import { deliverableTargetForm, deliverableTargetUpdateForm } from "./inputField.json";

function getInitialValues(props: DeliverableTargetProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Test Deliverable Target",
		description: "This is a sample deliverable",
		target_value: 0,
		deliverableCategory: "",
		deliverableUnit: "",
		deliverable_category_unit: -1,
		project: props.project,
	};
}
function DeliverableTarget(props: DeliverableTargetProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const [getUnitsByCategory, { data: unitsBycategory }] = useLazyQuery(GET_CATEGORY_UNIT); // for fetching units by category

	const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});

	const [currentCategory, setcurrentCategory] = useState<any>();
	const [deliverbaleTarget, setDeliverableTarget] = useState<IDeliverableTarget>();

	const [createDeliverableTarget, { loading: createDeliverableTargetLoading }] = useMutation(
		CREATE_DELIVERABLE_TARGET
	);

	const [updateDeliverableTarget, { loading: updateDeliverableTargetLoading }] = useMutation(
		UPDATE_DELIVERABLE_TARGET
	);

	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	const formAction = props.type;

	const createDeliverableTargetHelper = async (deliverableCategoryUnitId: string) => {
		try {
			let createInputTarget = {
				...deliverbaleTarget,
				deliverable_category_unit: deliverableCategoryUnitId,
			};
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
						const dataRead = await store.readQuery<any>({
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
						let deliverableTargets: any[] = dataRead?.deliverableTargetList
							? dataRead?.deliverableTargetList
							: [];

						store.writeQuery<any>({
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

						store.writeQuery<any>({
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
					} catch (err) {}
				},
				refetchQueries: [
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: { filter: { project: props.project } },
					},
				],
			});
			notificationDispatch(
				setSuccessNotification("Deliverable Target created successfully !")
			);
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable Target creation Failed !"));
		}
	};

	//  fetching category_unit id and on completion creating deliverable target
	const [getCategoryUnit] = useLazyQuery(GET_CATEGORY_UNIT, {
		onCompleted(data) {
			if (!data?.deliverableCategoryUnitList) return;
			if (!data.deliverableCategoryUnitList.length) return;

			createDeliverableTargetHelper(data.deliverableCategoryUnitList[0].id); //deliverable_category_unit id
		},
		onError(err) {
			notificationDispatch(setErrorNotification("Unit not match with category !"));
		},
	});

	// updating categories field with fetched categories list
	useEffect(() => {
		if (deliverableCategories) {
			deliverableTargetForm[2].optionsArray = deliverableCategories.deliverableCategory;
			deliverableTargetForm[2].getInputValue = setcurrentCategory;
		}
	}, [deliverableCategories]);

	// handling category change
	useEffect(() => {
		if (currentCategory) {
			getUnitsByCategory({
				variables: { filter: { deliverable_category_org: currentCategory } },
			});
		}
	}, [currentCategory, getUnitsByCategory]);

	// updating units field with fetched units list
	useEffect(() => {
		if (unitsBycategory) {
			let arr: any = [];
			console.log(unitsBycategory);
			unitsBycategory.deliverableCategoryUnitList.forEach(
				(elem: { deliverable_units_org: { id: string; name: string } }) => {
					arr.push({
						id: elem.deliverable_units_org.id,
						name: elem.deliverable_units_org.name,
					});
				}
			);
			deliverableTargetForm[3].optionsArray = arr;
		}
	}, [unitsBycategory]);

	let initialValues: IDeliverableTarget = getInitialValues(props);
	const onCreate = async (value: IDeliverableTarget) => {
		setDeliverableTarget({
			name: value.name,
			target_value: Number(value.target_value),
			description: value.description,
			project: value.project,
			deliverable_category_unit: -1,
		});

		// fetching deliverable_category_unit before creating deliverable Target
		getCategoryUnit({
			variables: {
				filter: {
					deliverable_category_org: value.deliverableCategory,
					deliverable_units_org: value.deliverableUnit,
				},
			},
		});
	};

	const onUpdate = async (value: IDeliverableTarget) => {
		let deliverableId = value.id;
		delete value.id;
		try {
			await updateDeliverableTarget({
				variables: {
					id: deliverableId,
					input: value,
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
				],
			});
			notificationDispatch(
				setSuccessNotification("Deliverable Target updated successfully !")
			);
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Deliverable Target Updation Failed !"));
		}
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
			if (!values.deliverableCategory) {
				errors.deliverableCategory = "Deliverable Category is required";
			}
			if (!values.deliverableUnit) {
				errors.deliverableUnit = "Deliverable Unit is required";
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

	return (
		<React.Fragment>
			<FormDialog
				title={
					(formAction === DELIVERABLE_ACTIONS.CREATE ? "New" : "Edit") +
					" Deliverable Target"
				}
				subtitle={"Physical addresses of your organisation like headquarter branch etc"}
				workspace={dashboardData?.workspace?.name}
				project={dashboardData?.project?.name}
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
						inputFields:
							formAction === DELIVERABLE_ACTIONS.CREATE
								? deliverableTargetForm
								: deliverableTargetUpdateForm,
					}}
				/>
			</FormDialog>
			{createDeliverableTargetLoading ? <FullScreenLoader /> : null}
			{updateDeliverableTargetLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default DeliverableTarget;
