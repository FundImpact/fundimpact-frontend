import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import {
	GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
	GET_DELIVERABLE_ORG_CATEGORY,
} from "../../graphql/Deliverable/category";
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
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import {
	GET_ALL_DELIVERABLES_SPEND_AMOUNT,
	GET_ALL_DELIVERABLES_TARGET_AMOUNT,
} from "../../graphql/project";
import Deliverable from "./Deliverable";
import DeliverableUnit from "./DeliverableUnit";
import { DELIVERABLE_TYPE, DIALOG_TYPE, FORM_ACTIONS } from "../../models/constants";
import DeleteModal from "../DeleteModal";
import {
	GET_DELIVERABLE_UNIT_BY_ORG,
	GET_DELIVERABLE_UNIT_PROJECT_COUNT,
	GET_UNIT,
} from "../../graphql/Deliverable/unit";
import { CREATE_PROJECT_WITH_DELIVERABLE_TARGET } from "../../graphql/Deliverable/projectWithDeliverableTarget";
import { GET_CATEGORIES } from "../../graphql/Category/query";
import Category from "../Category";
import Unit from "../Unit";

function getInitialValues(props: DeliverableTargetProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		description: "",
		unit: "",
		category: "",
		project: props.project,
	};
}

let typeVal: any;

function DeliverableTarget(props: DeliverableTargetProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	// const [getUnitsByOrg, { data: unitsByOrg }] = useLazyQuery(GET_DELIVERABLE_UNIT_BY_ORG); // for fetching units by category
	let types: any = props.formType;

	let deliverableId: number;
	let outcomeId: number;
	let outputId: number;
	let impactId: number;
	if (types === "deliverable") {
		deliverableId = 6;
		typeVal = 6;
	}
	if (types === "outcome") {
		outcomeId = 5;
		typeVal = 5;
	}
	if (types === "output") {
		outputId = 4;
		typeVal = 4;
	}
	if (types === "impact") {
		impactId = 3;
		typeVal = 3;
	}

	const { data: units } = useQuery(GET_UNIT);

	let unitType: any = [];
	units?.units?.forEach((elem: any) => {
		if (elem.type) {
			if (
				deliverableId == elem.type ||
				outcomeId == elem.type ||
				outputId == elem.type ||
				impactId == elem.type
			) {
				unitType.push(elem);
			}
		}
	});

	const [getOutputsByProject, { data: outputsByProject }] = useLazyQuery(
		GET_DELIVERABLE_TARGET_BY_PROJECT
	); // for fetching outputs by project

	console.log("outputsByProject", outputsByProject);

	// const { data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY, {
	// 	variables: { filter: { organization: dashboardData?.organization?.id } },
	// });

	const { data: categories } = useQuery(GET_CATEGORIES);

	console.log("categories", categories);

	let categoryType: any = [];
	categories?.categories.forEach((elem: any) => {
		if (elem.type) {
			if (
				deliverableId == elem.type ||
				outcomeId == elem.type ||
				outputId == elem.type ||
				impactId == elem.type
			) {
				categoryType.push(elem);
			}
		}
	});

	// const [currentCategory, setcurrentCategory] = useState<any>();
	// const [deliverbaleTarget, setDeliverableTarget] = useState<IDeliverableTarget>();

	const [createProjectWithDeliverableTarget] = useMutation(
		CREATE_PROJECT_WITH_DELIVERABLE_TARGET
	);

	const [createDeliverableTarget, { loading: createDeliverableTargetLoading }] = useMutation(
		CREATE_DELIVERABLE_TARGET,
		{
			onCompleted: async (data) => {
				console.log("createdata", data);
				if (data?.createDeliverableTarget) {
					try {
						await createProjectWithDeliverableTarget({
							variables: {
								input: {
									data: {
										project: dashboardData?.project?.id,
										deliverable_target_project:
											data?.createDeliverableTarget?.id,
										category: data?.createDeliverableTarget?.category?.id,
									},
								},
							},
							refetchQueries: [
								{
									query: GET_DELIVERABLE_TARGETS_COUNT,
									variables: {
										filter: {
											// project: dashboardData?.project?.id,
											project_with_deliverable_targets: {
												project: dashboardData?.project?.id,
											},
											type: typeVal,
											// type: props.formType,
										},
									},
								},
								{
									query: GET_DELIVERABLE_TARGET_BY_PROJECT,
									variables: {
										filter: {
											// project_with_deliverable_targets: {
											project: dashboardData?.project?.id,
											// },
											type: typeVal,
											// type: props.formType,
										},
									},
								},
							],
						});
					} catch (error: any) {
						notificationDispatch(setErrorNotification(error?.message));
					}
				}
			},
		}
	);

	const [updateDeliverableTarget, { loading: updateDeliverableTargetLoading }] = useMutation(
		UPDATE_DELIVERABLE_TARGET
	);

	if (props.type === DELIVERABLE_ACTIONS.UPDATE && props?.data?.is_qualitative) {
		deliverableTargetForm[5].hidden = false;
		deliverableTargetForm[6].hidden = false;
	}

	if (props.type === DELIVERABLE_ACTIONS.UPDATE) {
		deliverableTargetForm[5].disabled = true;
	} else {
		deliverableTargetForm[5].disabled = false;
	}
	const formIsOpen = props.open;
	const onCancel = () => {
		// deliverableTargetForm[4].hidden = true;
		deliverableTargetForm[6].hidden = true;
		props.handleClose();
	};
	const formAction = props.type;
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);

	const [openDeliverableCategoryDialog, setOpenDeliverableCategoryDialog] = useState<boolean>();
	deliverableTargetForm[2].addNewClick = () => setOpenDeliverableCategoryDialog(true);

	const [openDeliverableUnitDialog, setOpenDeliverableUnitDialog] = useState<boolean>();
	deliverableTargetForm[3].addNewClick = () => setOpenDeliverableUnitDialog(true);

	deliverableTargetForm[5].getInputValue = (is_qualitative: boolean) => {
		if (is_qualitative) {
			deliverableTargetForm[4].hidden = true;
			deliverableTargetForm[6].hidden = false;
		} else {
			deliverableTargetForm[4].hidden = false;
			deliverableTargetForm[6].hidden = true;
		}
	};

	const createDeliverableTargetHelper = async (deliverableTarget: IDeliverableTarget) => {
		try {
			let createInputTarget = {
				...deliverableTarget,
				// deliverable_category_unit: deliverableCategoryUnitId,
			};
			delete (createInputTarget as any).id;

			await createDeliverableTarget({
				variables: {
					input: { ...createInputTarget, type: typeVal },
					// input: { ...createInputTarget, type: props.formType },
				},
				// update: async (store, { data: { createDeliverableTarget: targetCreated } }) => {
				// 	try {
				// 		const count = await store.readQuery<{ deliverableTargetCount: number }>({
				// 			query: GET_DELIVERABLE_TARGETS_COUNT,
				// 			variables: {
				// 				filter: {
				// 					project_with_deliverable_targets: {
				// 						project: dashboardData?.project?.id,
				// 					},
				// 					type: props.formType,
				// 				},
				// 			},
				// 		});

				// 		store.writeQuery<{ deliverableTargetCount: number }>({
				// 			query: GET_DELIVERABLE_TARGETS_COUNT,
				// 			variables: {
				// 				filter: {
				// 					project_with_deliverable_targets: {
				// 						project: dashboardData?.project?.id,
				// 					},
				// 					type: props.formType,
				// 				},
				// 			},
				// 			data: {
				// 				deliverableTargetCount: count!.deliverableTargetCount + 1,
				// 			},
				// 		});

				// 		let limit = 0;
				// 		if (count) {
				// 			limit = count.deliverableTargetCount;
				// 		}
				// 		const dataRead = await store.readQuery<IGET_DELIVERABLE_TARGET_BY_PROJECT>({
				// 			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
				// 			variables: {
				// 				filter: {
				// 					project_with_deliverable_targets: {
				// 						project: dashboardData?.project?.id,
				// 					},
				// 					type: props.formType,
				// 				},
				// 				limit: limit > 10 ? 10 : limit,
				// 				start: 0,
				// 				sort: "created_at:DESC",
				// 			},
				// 		});
				// 		let deliverableTargets: IDeliverableTargetByProjectResponse[] = dataRead?.deliverableTargetList
				// 			? dataRead?.deliverableTargetList
				// 			: [];
				// 		store.writeQuery<IGET_DELIVERABLE_TARGET_BY_PROJECT>({
				// 			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
				// 			variables: {
				// 				filter: {
				// 					project_with_deliverable_targets: {
				// 						project: dashboardData?.project?.id,
				// 					},
				// 					type: props.formType,
				// 				},
				// 				limit: limit > 10 ? 10 : limit,
				// 				start: 0,
				// 				sort: "created_at:DESC",
				// 			},
				// 			data: {
				// 				deliverableTargetList: [...deliverableTargets, targetCreated],
				// 			},
				// 		});

				// 		store.writeQuery<IGET_DELIVERABLE_TARGET_BY_PROJECT>({
				// 			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
				// 			variables: {
				// 				filter: {
				// 					project_with_deliverable_targets: {
				// 						project: dashboardData?.project?.id,
				// 					},
				// 					type: props.formType,
				// 				},
				// 			},
				// 			data: {
				// 				deliverableTargetList: [...deliverableTargets, targetCreated],
				// 			},
				// 		});
				// 	} catch (err) {
				// 		console.error(err);
				// 	}
				// },
				refetchQueries: [
					{
						query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
						variables: {
							filter: {
								project: props.project,
								deliverable_target_project: {
									type: typeVal,
									// type: props.formType,
								},
							},
						},
					},
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: {
							filter: {
								// project_with_deliverable_targets: {
								project: props.project,
								// },
								type: typeVal,
								// type: props.formType,
								// sub_target_required: true,
							},
						},
					},
				],
			});
			// setcurrentCategory("");
			notificationDispatch(setSuccessNotification("Target created successfully !"));
			onCancel();
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error.message));
		}
	};

	const updateDeliverableTargetHelper = async (deliverableTarget: IDeliverableTarget) => {
		let options = [];
		if (props.type === DELIVERABLE_ACTIONS.UPDATE) {
			options = deliverableTarget?.value_qualitative_option?.split(",") || [];
			// iF NAME EXIST PROVIDING THE SAME ID OTHERWISE A NEW ID
			options = options.map((elem: string) => ({
				id:
					props.value_qualitative_option.find((e) => e.name === elem.trim())?.id ||
					uuidv4(),
				name: elem.trim(),
			}));
		}
		let createInputTarget: any = {
			...deliverableTarget,
			value_qualitative_option: { options },
			// deliverable_category_unit: deliverableCategoryUnitId,
		};

		let deliverableId = createInputTarget.id;

		delete (createInputTarget as any).id;

		try {
			await updateDeliverableTarget({
				variables: {
					id: parseInt(deliverableId),
					input: createInputTarget,
				},
				refetchQueries: [
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: {
							limit: 10,
							start: 0,
							sort: "created_at:DESC",
							filter: {
								// project_with_deliverable_targets: {
								project: props.project,
								// },
								type: typeVal,
								// type: props.formType,
							},
						},
					},
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: {
							filter: {
								// project_with_deliverable_targets: {
								project: props.project,
								// },
								type: typeVal,
								// type: props.formType,
								// sub_target_required: true,
							},
						},
					},
					{
						query: GET_DELIVERABLE_TARGET_BY_PROJECT,
						variables: {
							filter: {
								// project_with_deliverable_targets: {
								project: props.project,
								// },
								type: typeVal,
								// type: props.formType,
							},
						},
					},
					// {
					// 	query: GET_ACHIEVED_VALLUE_BY_TARGET,
					// 	variables: {
					// 		filter: { deliverableTargetProject: deliverableId },
					// 	},
					// },
					{
						query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
						variables: {
							filter: {
								project: props.project,
								deliverable_target_project: {
									type: typeVal,
									// type: props.formType,
								},
							},
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Target updated successfully !"));
			// setcurrentCategory("");
			onCancel();
		} catch (error: any) {
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
		if (outputsByProject) {
			deliverableTargetForm[0].optionsArray = outputsByProject.deliverableTargetList;
		}
	}, [outputsByProject]);

	// useEffect(() => {
	// 	if (deliverableCategories) {
	// 		deliverableTargetForm[2].optionsArray = deliverableCategories.deliverableCategory;
	// 	}
	// }, [deliverableCategories]);

	useEffect(() => {
		if (categories) {
			deliverableTargetForm[2].optionsArray = categoryType;
			// deliverableTargetForm[2].optionsArray = categories?.categories;
		}
	}, [categories]);

	useEffect(() => {
		if (units) {
			deliverableTargetForm[3].optionsArray = unitType;
			// deliverableTargetForm[3].optionsArray = units?.units;
		}
	}, [units]);
	// useEffect(() => {
	// 	if (unitsByOrg) {
	// 		deliverableTargetForm[3].optionsArray = unitsByOrg.deliverableUnitOrg;
	// 	}
	// }, [unitsByOrg]);

	// handling category change
	// useEffect(() => {
	// 	if (dashboardData?.organization?.id) {
	// 		getUnitsByOrg({
	// 			variables: { filter: { organization: dashboardData?.organization?.id } },
	// 		});
	// 	}
	// }, [dashboardData, getUnitsByOrg]);

	useEffect(() => {
		if (dashboardData?.project?.id) {
			let allowedProps = ["deliverable", "output", "outcome"];
			let parentProps: any = { deliverable: "output", output: "outcome", outcome: "impact" };
			let val: any;

			if (props.formType == "deliverable") {
				val = 4;
			}
			if (props.formType == "output") {
				val = 5;
			}
			if (props.formType == "outcome") {
				val = 3;
			}

			if (allowedProps.includes(props.formType)) {
				// if (allowedProps.includes(props.formType)) {
				getOutputsByProject({
					variables: {
						filter: {
							// project_with_deliverable_targets: {
							project: dashboardData?.project?.id,
							// },
							// type: parentProps[typeVal],
							// type: parentProps[props.formType],
							type: val,
						},
					},
				});
				deliverableTargetForm[0].hidden = false;
				deliverableTargetForm[0].label =
					parentProps[props.formType].charAt(0).toUpperCase() +
					parentProps[props.formType].slice(1);
			}

			if (props.formType === "impact") {
				deliverableTargetForm[0].hidden = true;
			}
		}
	}, [dashboardData, getOutputsByProject, props.formType]);

	let initialValues: IDeliverableTarget = getInitialValues(props);

	const onCreate = async (value: IDeliverableTarget) => {
		let options = value?.value_qualitative_option?.split(",") || [];
		options = options.map((elem: string) => ({ id: uuidv4(), name: elem.trim() }));

		let valueOptions = {
			options,
		};

		await createDeliverableTargetHelper({
			id: value.id,
			name: value.name,
			description: value.description,
			project: value.project,
			category: value?.category,
			unit: value?.unit,
			is_qualitative: value.is_qualitative,
			sub_target_required: true,
			value_calculation: value.value_calculation,
			value_qualitative_option: valueOptions,
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
			if (values.is_qualitative) {
				if (!values.value_qualitative_option) {
					errors.value_qualitative_option = "Options are required";
				}
			} else {
				if (!values.value_calculation) {
					errors.value_calculation = "This Field is required";
				}
			}

			if (!values.category) {
				errors.category = "Deliverable Category is required";
			}
			if (!values.unit) {
				errors.unit = "Deliverable Unit is required";
			}
			// if (!values.deliverable_category_org) {
			// 	errors.deliverable_category_org = "Deliverable Category is required";
			// }
			// if (!values.deliverable_unit_org) {
			// 	errors.deliverable_unit_org = "Deliverable Unit is required";
			// }
		}

		if (props.type === DELIVERABLE_ACTIONS.UPDATE) {
			if (!values.name && !values.name.length) {
				errors.name = "Name is required";
			}
			if (!values.project) {
				errors.project = "Project is required";
			}
			if (values.is_qualitative) {
				if (!values.value_qualitative_option) {
					errors.value_qualitative_option = "Options are required";
				}
			} else {
				if (!values.value_calculation) {
					errors.value_calculation = "This Field is required";
				}
			}
		}
		return errors;
	};
	const intl = useIntl();
	const onDelete = async () => {
		try {
			const deliverableTargetValues = { ...initialValues };

			console.log("deliverableTargetValues", deliverableTargetValues);

			delete deliverableTargetValues["id"];
			if (
				!deliverableTargetValues.value_qualitative_option ||
				deliverableTargetValues.value_qualitative_option === "-"
			)
				delete deliverableTargetValues.value_qualitative_option;

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
						variables: {
							filter: { project: dashboardData?.project?.id, type: typeVal },
						},
					},
					// {
					// 	query: GET_ACHIEVED_VALLUE_BY_TARGET,
					// 	variables: {
					// 		filter: { deliverableTargetProject: initialValues.id },
					// 	},
					// },
					{
						query: GET_ALL_DELIVERABLES_TARGET_AMOUNT,
						variables: {
							filter: {
								project: dashboardData?.project?.id,
								deliverable_target_project: {
									type: typeVal,
									// type: props.formType,
								},
							},
						},
					},
					{
						query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_DELIVERABLE_TARGETS_COUNT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					// {
					// 	query: GET_DELIVERABLE_CATEGORY_PROJECT_COUNT,
					// 	variables: {
					// 		filter: {
					// 			deliverable_category_org: deliverableTargetValues?.category,
					// 			// deliverableTargetValues?.deliverable_category_org,
					// 		},
					// 	},
					// },
					// {
					// 	query: GET_DELIVERABLE_UNIT_PROJECT_COUNT,
					// 	variables: {
					// 		filter: {
					// 			deliverable_unit_org: deliverableTargetValues?.unit,
					// 			// deliverable_unit_org: deliverableTargetValues?.deliverable_unit_org,
					// 		},
					// 	},
					// },
				],
			});
			notificationDispatch(setSuccessNotification("Deliverable Target Delete Success"));
		} catch (err: any) {
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
					(props.formType === DELIVERABLE_TYPE.DELIVERABLE
						? intl.formatMessage({
								id: "deliverableTargetFormTitle",
								defaultMessage: "Deliverable Target",
								description: `This text will be show on deliverable target form for title`,
						  })
						: props.formType === DELIVERABLE_TYPE.IMPACT
						? intl.formatMessage({
								id: "impactTargetFormTitle",
								defaultMessage: "Impact Target",
								description: `This text will be show on impact Target form for title`,
						  })
						: props.formType === DELIVERABLE_TYPE.OUTCOME
						? intl.formatMessage({
								id: "OutcomeTargetFormTitle",
								defaultMessage: "Outcome Target",
								description: `This text will be show on Outcome Target form for title`,
						  })
						: props.formType === DELIVERABLE_TYPE.OUTPUT
						? intl.formatMessage({
								id: "OutputTargetFormTitle",
								defaultMessage: "Output Target",
								description: `This text will be show on Output Target form for title`,
						  })
						: props.formType === DELIVERABLE_TYPE.ACTIVITY
						? intl.formatMessage({
								id: "ActivityTargetFormTitle",
								defaultMessage: "Activity Target",
								description: `This text will be show on Activity Target form for title`,
						  })
						: "")
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
					<Category
						formAction={FORM_ACTIONS.CREATE}
						open={openDeliverableCategoryDialog}
						handleClose={() => setOpenDeliverableCategoryDialog(false)}
						// organization={dashboardData?.organization?.id}
					/>
					// <Deliverable
					// 	type={DELIVERABLE_ACTIONS.CREATE}
					// 	open={openDeliverableCategoryDialog}
					// 	handleClose={() => setOpenDeliverableCategoryDialog(false)}
					// 	organization={dashboardData?.organization?.id}
					// />
				)}
				{openDeliverableUnitDialog && (
					<Unit
						formAction={FORM_ACTIONS.CREATE}
						open={openDeliverableUnitDialog}
						handleClose={() => setOpenDeliverableUnitDialog(false)}
					/>
					// <DeliverableUnit
					// 	type={DELIVERABLE_ACTIONS.CREATE}
					// 	open={openDeliverableUnitDialog}
					// 	handleClose={() => setOpenDeliverableUnitDialog(false)}
					// 	organization={dashboardData?.organization?.id}
					// />
				)}
			</FormDialog>
			{createDeliverableTargetLoading ? <FullScreenLoader /> : null}
			{updateDeliverableTargetLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default DeliverableTarget;
