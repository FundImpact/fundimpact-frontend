import React, { useEffect, useState } from "react";
import { IImpactTarget, ImpactTargetProps } from "../../models/impact/impactTarget";
import { FullScreenLoader } from "../Loader/Loader";
import { IMPACT_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { GET_IMPACT_CATEGORY_UNIT } from "../../graphql/queries/Impact/categoryUnit";
import {
	CREATE_IMPACT_TARGET,
	UPDATE_IMAPACT_TARGET,
	GET_ACHIEVED_VALLUE_BY_TARGET,
} from "../../graphql/queries/Impact/target";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GET_IMPACT_CATEGORY } from "../../graphql/queries/Impact/category";
import { GET_IMPACT_TARGET_BY_PROJECT } from "../../graphql/queries/Impact/target";
import { impactTargetForm, impactTargetUpdateForm } from "./inputField.json";
import { DashboardProvider, useDashBoardData } from "../../contexts/dashboardContext";
import { FORM_ACTIONS } from "../../models/budget/constants";
function getInitialValues(props: ImpactTargetProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "Impact TARGET",
		description: "This is a sample Impact TARGET",
		target_value: "",
		impactCategory: "",
		impactUnit: "",
		impact_category_unit: "",
		project: props.project,
	};
}
function ImpactTarget(props: ImpactTargetProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const { data: categories } = useQuery(GET_IMPACT_CATEGORY);
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
				refetchQueries: [
					{
						query: GET_IMPACT_TARGET_BY_PROJECT,
						variables: { filter: { project: props.project } },
					},
				],
			});
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
		delete value.id;
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
						variables: { filter: { project: props.project } },
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
				errors.deliverableCategory = "Deliverable Category is required here";
			}
			if (!values.impactUnit) {
				errors.deliverableUnit = "Deliverable Unit is required here";
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
