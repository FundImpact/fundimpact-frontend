import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";

import { DashboardProvider, useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_IMPACT_CATEGORY_UNIT } from "../../graphql/Impact/categoryUnit";
import {
	GET_ALL_IMPACT_AMOUNT_SPEND,
	GET_ALL_IMPACT_TARGET_AMOUNT,
	GET_IMPACT_CATEGORY_BY_ORG,
	GET_IMPACT_UNIT_BY_ORG,
	GET_IMPACT_UNIT_PROJECT_COUNT,
} from "../../graphql/Impact/query";
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
import { impactTargetForm } from "./inputField.json";
import {
	IGET_IMPACT_TARGET_BY_PROJECT,
	IImpactTargetByProjectResponse,
} from "../../models/impact/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";
import { GET_IMPACT_TARGET_SDG_COUNT } from "../../graphql/project";
import ImpactCategoryDialog from "./ImpactCategoryDialog";
import { FORM_ACTIONS } from "../Forms/constant";
import ImpactUnitDialog from "./ImpactUnitDialog/ImpaceUnitDialog";
import { DIALOG_TYPE } from "../../models/constants";
import DeleteModal from "../DeleteModal";
import { GET_IMPACT_CATEGORY_PROJECT_COUNT } from "../../graphql/Impact/category";

// import { DashboardProvider } from "../../contexts/dashboardContext";
function getInitialValues(props: ImpactTargetProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) {
		return { ...props.data };
	}
	return {
		name: "",
		description: "",
		target_value: "",
		impact_category_org: "",
		impact_units_org: "",
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

	// const [currCategoryId, setCurrentCategoryId] = React.useState<number | string>();

	const [getUnitsByOrg, { data: unitByOrg }] = useLazyQuery(
		GET_IMPACT_UNIT_BY_ORG,
		process.env.NODE_ENV !== "test"
			? {
					fetchPolicy: "cache-and-network",
			  }
			: {}
	); // for fetching units by category

	// const [impactTarget, setImpactTarget] = useState<IImpactTarget>();
	const [createImpactTarget, { loading: impactLoading }] = useMutation(CREATE_IMPACT_TARGET);

	const [updateImpactTarget, { loading: updateImpactTargetLoading }] = useMutation(
		UPDATE_IMAPACT_TARGET
	);

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
	let { newOrEdit } = CommonFormTitleFormattedMessage(formAction);
	//for fetching category_unit id and creating impact target

	const [openImpactCategoryDialog, setOpenImpactCategoryDialog] = useState<boolean>();
	impactTargetForm[2].addNewClick = () => setOpenImpactCategoryDialog(true);

	const [openImpactUnitDialog, setOpenImpactUnitDialog] = useState<boolean>();
	impactTargetForm[3].addNewClick = () => setOpenImpactUnitDialog(true);

	// const [getUnitsAndCategory] = useLazyQuery(GET_IMPACT_CATEGORY_UNIT, {
	// 	onCompleted(data) {
	// 		if (data.impactCategoryUnitList && data.impactCategoryUnitList.length) {
	// 			if (props.type === IMPACT_ACTIONS.CREATE)
	// 				onCreate(data.impactCategoryUnitList[0].id);
	// 			else onUpdate(data.impactCategoryUnitList[0].id);
	// 		}
	// 	},
	// 	onError() {
	// 		notificationDispatch(setErrorNotification("No units found for category!"));
	// 	},
	// 	fetchPolicy: "network-only",
	// });

	// useEffect(() => {
	// 	let impactTargetprops = props;
	// 	if (impactTargetprops.type === IMPACT_ACTIONS.UPDATE) {
	// 		setCurrentCategoryId(impactTargetprops.data?.impactCategory);
	// 	}
	// }, [props]);

	const onUpdate = async (impactTarget: IImpactTarget) => {
		let createInputTarget: any = {
			...impactTarget,
		};
		let impactId = createInputTarget.id;
		delete (createInputTarget as any).id;
		createInputTarget.target_value = Number(createInputTarget.target_value);
		try {
			updateImpactTarget({
				variables: {
					id: impactId,
					input: createInputTarget,
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
					{
						query: GET_IMPACT_TARGET_SDG_COUNT,
						variables: {
							filter: { organization: dashboardData?.organization?.id },
						},
					},
					{
						query: GET_ALL_IMPACT_TARGET_AMOUNT,
						variables: {
							filter: { project: props.project },
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Impact Target updated successfully !"));
		} catch (error) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const onCreate = async (impactTarget: IImpactTarget) => {
		try {
			let createInputTarget = {
				...impactTarget,
			};
			createInputTarget.target_value = Number(createInputTarget.target_value);
			delete createInputTarget.id;
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
					{
						query: GET_IMPACT_TARGET_SDG_COUNT,
						variables: {
							filter: { organization: dashboardData?.organization?.id },
						},
					},
					{
						query: GET_ALL_IMPACT_TARGET_AMOUNT,
						variables: {
							filter: { project: props.project },
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Impact Target Successfully created !"));
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};
	// updating categories field with fetched categories list
	useEffect(() => {
		if (categories) {
			impactTargetForm[2].optionsArray = categories.impactCategoryOrgList;
		}
	}, [categories]);
	useEffect(() => {
		if (unitByOrg) {
			impactTargetForm[3].optionsArray = unitByOrg.impactUnitsOrgList;
		}
	}, [unitByOrg]);

	// updating sdg field with fetched sdg list
	useEffect(() => {
		if (sdgList) {
			impactTargetForm[4].optionsArray = sdgList.sustainableDevelopmentGoalList;
		}
	}, [sdgList]);

	// handling category change
	useEffect(() => {
		if (dashboardData?.organization?.id) {
			getUnitsByOrg({
				variables: { filter: { organization: dashboardData?.organization?.id } },
			});
		}
	}, [dashboardData, getUnitsByOrg]);

	let initialValues: IImpactTarget = getInitialValues(props);

	const validate = (values: IImpactTarget) => {
		let errors: Partial<any> = {};

		if (!values.name && !values.name.length) {
			errors.name = "Name is required here";
		}
		if (!values.project) {
			errors.project = "Project is required here";
		}
		if (!values.target_value) {
			errors.target_value = "Target value is required here";
		}
		if (!values.impact_category_org) {
			errors.impact_category_org = "Category is required here";
		}
		if (!values.impact_units_org) {
			errors.impact_units_org = "Unit is required here";
		}
		return errors;
	};

	const onDelete = async () => {
		try {
			const impactTargetValues = { ...initialValues };
			delete impactTargetValues["id"];
			await updateImpactTarget({
				variables: {
					id: initialValues?.id,
					input: {
						deleted: true,
						...impactTargetValues,
					},
				},
				refetchQueries: [
					{
						query: GET_IMPACT_TARGET_BY_PROJECT,
						variables: { filter: { project: dashboardData?.project?.id } },
					},
					{
						query: GET_IMPACT_TARGET_SDG_COUNT,
						variables: {
							filter: { organization: dashboardData?.organization?.id },
						},
					},
					{
						query: GET_ALL_IMPACT_TARGET_AMOUNT,
						variables: {
							filter: { project: dashboardData?.project?.id },
						},
					},
					{
						query: GET_ALL_IMPACT_AMOUNT_SPEND,
						variables: {
							filter: { project: dashboardData?.project?.id },
						},
					},
					{
						query: GET_IMPACT_TARGETS_COUNT,
						variables: {
							filter: { project: dashboardData?.project?.id },
						},
					},
					{
						query: GET_IMPACT_CATEGORY_PROJECT_COUNT,
						variables: {
							filter: {
								impact_category_org: impactTargetValues?.impact_category_org,
							},
						},
					},
					{
						query: GET_IMPACT_UNIT_PROJECT_COUNT,
						variables: {
							filter: { impact_unit_org: impactTargetValues?.impact_units_org },
						},
					},
				],
			});
			notificationDispatch(setSuccessNotification("Impact Target Delete Success"));
		} catch (err) {
			notificationDispatch(setErrorNotification(err.message));
		} finally {
			onCancel();
		}
	};

	const intl = useIntl();

	if (props.dialogType === DIALOG_TYPE.DELETE) {
		return (
			<DeleteModal
				handleClose={onCancel}
				open={props.open}
				title="Delete Impact Target"
				onDeleteConformation={onDelete}
			/>
		);
	}

	return (
		<DashboardProvider>
			<FormDialog
				title={
					newOrEdit +
					" " +
					intl.formatMessage({
						id: "impactTargetFormTitle",
						defaultMessage: "Impact Target",
						description: `This text will be show on impact Target form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "impactTargetFormSubtitle",
					defaultMessage:
						"Physical addresses of your organization like headquater, branch etc.",
					description: `This text will be show on impact Target form for subtitle`,
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
						inputFields: impactTargetForm,
					}}
				/>
				{openImpactCategoryDialog && (
					<ImpactCategoryDialog
						formAction={FORM_ACTIONS.CREATE}
						open={openImpactCategoryDialog}
						handleClose={() => setOpenImpactCategoryDialog(false)}
						organization={dashboardData?.organization?.id}
					/>
				)}
				{openImpactUnitDialog && (
					<ImpactUnitDialog
						formAction={FORM_ACTIONS.CREATE}
						open={openImpactUnitDialog}
						handleClose={() => setOpenImpactUnitDialog(false)}
						organization={dashboardData?.organization?.id || ""}
					/>
				)}
			</FormDialog>
			{impactLoading ? <FullScreenLoader /> : null}
			{updateImpactTargetLoading ? <FullScreenLoader /> : null}
		</DashboardProvider>
	);
}

export default ImpactTarget;
