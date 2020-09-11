import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { DashboardProvider, useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_IMPACT_CATEGORY_UNIT } from "../../graphql/Impact/categoryUnit";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../graphql/Impact/query";
import {
	CREATE_IMPACT_TARGET,
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
	GET_IMPACT_TARGETS_COUNT,
	UPDATE_IMAPACT_TARGET,
} from "../../graphql/Impact/target";
import { GET_SDG } from "../../graphql/SDG/query";
import { IImpactTarget, ImpactTargetProps } from "../../models/impact/impactTarget";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { IMPACT_ACTIONS } from "./constants";
import { impactTargetForm, impactTargetUpdateForm } from "./inputField.json";
import {
	IGET_IMPACT_TARGET_BY_PROJECT,
	IImpactTargetByProjectResponse,
} from "../../models/impact/query";

// import { DashboardProvider } from "../../contexts/dashboardContext";
function getInitialValues(props: ImpactTargetProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		description: "",
		target_value: "",
		impactCategory: "",
		impactUnit: "",
		impact_category_unit: "",
		sustainable_development_goal: "",
		project: props.project,
	};
}
function ImpactTarget(props: ImpactTargetProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const { data: categories } = useQuery(GET_IMPACT_CATEGORY_BY_ORG, {
		variables: { filter: { organization: dashboardData?.organization?.id } },
	});
	const { data: sdgList } = useQuery(GET_SDG);

	const [currCategoryId, setCurrentCategoryId] = React.useState<number>();

	const [getUnitsByCategory, { data: unitByCategory }] = useLazyQuery(GET_IMPACT_CATEGORY_UNIT); // for fetching units by category

	const [impactTarget, setImpactTarget] = useState<IImpactTarget>();
	const [createImpactTarget, { loading: impactLoading }] = useMutation(CREATE_IMPACT_TARGET);

	const [updateImpactTarget, { loading: updateImpactTargetLoading }] = useMutation(
		UPDATE_IMAPACT_TARGET
	);

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	//for fetching category_unit id and creating impact target
	const [getUnitsAndCategory] = useLazyQuery(GET_IMPACT_CATEGORY_UNIT, {
		onCompleted(data) {
			if (data.impactCategoryUnitList && data.impactCategoryUnitList.length) {
				createImpactTargetHelper(data.impactCategoryUnitList[0].id);
			}
		},
		onError() {
			notificationDispatch(setErrorNotification("No units found for category!"));
		},
	});

	const createImpactTargetHelper = async (impactCategoryUnitId: string) => {
		try {
			let createInputTarget = {
				...impactTarget,
				impact_category_unit: impactCategoryUnitId,
			};

			createImpactTarget({
				variables: {
					input: createInputTarget,
				},
				update: async (
					store,
					{ data: { createImpactTargetProjectInput: targetCreated } }
				) => {
					try {
						const count = await store.readQuery<{ impactTargetProjectCount: number }>({
							query: GET_IMPACT_TARGETS_COUNT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
						});

						store.writeQuery<{ impactTargetProjectCount: number }>({
							query: GET_IMPACT_TARGETS_COUNT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
							data: {
								impactTargetProjectCount: count!.impactTargetProjectCount + 1,
							},
						});

						let limit = 0;
						if (count) {
							limit = count.impactTargetProjectCount;
						}
						const dataRead = await store.readQuery<IGET_IMPACT_TARGET_BY_PROJECT>({
							query: GET_IMPACT_TARGET_BY_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
						});
						let impactTargetProjectList: IImpactTargetByProjectResponse[] = dataRead?.impactTargetProjectList
							? dataRead?.impactTargetProjectList
							: [];

						store.writeQuery<IGET_IMPACT_TARGET_BY_PROJECT>({
							query: GET_IMPACT_TARGET_BY_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
								limit: limit > 10 ? 10 : limit,
								start: 0,
								sort: "created_at:DESC",
							},
							data: {
								impactTargetProjectList: [
									...impactTargetProjectList,
									targetCreated,
								],
							},
						});

						store.writeQuery<IGET_IMPACT_TARGET_BY_PROJECT>({
							query: GET_IMPACT_TARGET_BY_PROJECT,
							variables: {
								filter: {
									project: dashboardData?.project?.id,
								},
							},
							data: {
								impactTargetProjectList: [
									...impactTargetProjectList,
									targetCreated,
								],
							},
						});
					} catch (err) {
						console.error(err);
					}
				},
				refetchQueries: [
					{
						query: GET_IMPACT_TARGET_BY_PROJECT,
						variables: { filter: { project: props.project } },
					},
				],
			});
			impactTargetForm[3].optionsArray = []; // set empty units after creation
			notificationDispatch(setSuccessNotification("Impact Target Successfully created !"));
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Target creation Failed !"));
		}
	};
	// updating categories field with fetched categories list
	useEffect(() => {
		if (categories) {
			impactTargetForm[2].optionsArray = categories.impactCategoryOrgList;
			impactTargetForm[2].getInputValue = setCurrentCategoryId;
		}
	}, [categories]);

	// updating sdg field with fetched sdg list
	useEffect(() => {
		if (sdgList) {
			impactTargetForm[4].optionsArray = sdgList.sustainableDevelopmentGoalList;
		}
	}, [sdgList]);

	// handling category change
	useEffect(() => {
		if (currCategoryId) {
			getUnitsByCategory({
				variables: { filter: { impact_category_org: currCategoryId } },
			});
		}
	}, [currCategoryId, getUnitsByCategory]);

	// updating units field with fetched units list
	useEffect(() => {
		if (unitByCategory) {
			let arr: any = [];
			unitByCategory.impactCategoryUnitList.forEach(
				(elem: { impact_units_org: { id: number; name: string } }) => {
					arr.push({
						id: elem.impact_units_org.id,
						name: elem.impact_units_org.name,
					});
				}
			);

			impactTargetForm[3].optionsArray = arr;
		}
	}, [unitByCategory]);

	let initialValues: IImpactTarget = getInitialValues(props);

	const onCreate = (value: IImpactTarget) => {
		// fetch impact_category_unit_id
		setImpactTarget({
			name: value.name,
			target_value: Number(value.target_value),
			description: value.description,
			project: value.project,
			impact_category_unit: -1,
			sustainable_development_goal: value.sustainable_development_goal,
		});
		// Query call for fetching impact_categroy_unit_id
		getUnitsAndCategory({
			variables: {
				filter: {
					impact_category_org: value.impactCategory,
					impact_units_org: value.impactUnit,
				},
			},
		});
	};

	const onUpdate = (value: IImpactTarget) => {
		let impactId = value.id;
		delete (value as any).id;
		value.target_value = Number(value.target_value);
		try {
			updateImpactTarget({
				variables: {
					id: impactId,
					input: value,
				},
				refetchQueries: [
					{
						query: GET_IMPACT_TARGET_BY_PROJECT,
						variables: {
							limit: 10,
							start: 0,
							sort: "created_at:DESC",
							filter: { project: props.project },
						},
					},
					{
						query: GET_IMPACT_TARGET_BY_PROJECT,
						variables: {
							filter: { project: props.project },
						},
					},
					{
						query: GET_ACHIEVED_VALLUE_BY_TARGET,
						variables: {
							filter: { impactTargetProject: impactId },
						},
					},
				],
			});
			notificationDispatch(
				setSuccessNotification("Deliverable Target updated successfully !")
			);
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Target Updation Failed !"));
		}
	};
	const validate = (values: IImpactTarget) => {
		let errors: Partial<any> = {};
		if (props.type === IMPACT_ACTIONS.CREATE) {
			if (!values.name && !values.name.length) {
				errors.name = "Name is required here";
			}
			if (!values.project) {
				errors.project = "Project is required here";
			}
			if (!values.target_value) {
				errors.target_value = "Target value is required here";
			}
			if (!values.impactCategory) {
				errors.deliverableCategory = "Category is required here";
			}
			if (!values.impactUnit) {
				errors.deliverableUnit = "Unit is required here";
			}
		}

		if (props.type === IMPACT_ACTIONS.UPDATE) {
			if (!values.name && !values.name.length) {
				errors.name = "Name is required here";
			}
			if (!values.project) {
				errors.project = "Project is required here";
			}
			if (!values.target_value) {
				errors.target_value = "Target value is required here";
			}
		}
		return errors;
	};

	return (
		<DashboardProvider>
			<FormDialog
				title={(formAction === IMPACT_ACTIONS.CREATE ? "New" : "Edit") + " Impact Target"}
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
							formAction === IMPACT_ACTIONS.CREATE
								? impactTargetForm
								: impactTargetUpdateForm,
					}}
				/>
			</FormDialog>
			{impactLoading ? <FullScreenLoader /> : null}
			{updateImpactTargetLoading ? <FullScreenLoader /> : null}
		</DashboardProvider>
	);
}

export default ImpactTarget;
