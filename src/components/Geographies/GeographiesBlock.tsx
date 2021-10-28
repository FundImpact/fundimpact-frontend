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
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";

import {
	CREATE_DELIVERABLE_UNIT,
	UPDATE_DELIVERABLE_UNIT_ORG,
	GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
	GET_DELIVERABLE_UNIT_BY_ORG,
} from "../../graphql/Deliverable/unit";
import { GEOGRAPHIES_ACTIONS } from "./constants";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { GeographiesBlockForm } from "./inputField.json";
import {
	IGetDeliverablUnit,
	// IGetDeliverableCategoryUnit,
	// IGetDeliverableCategoryUnitVariables,
	// IUpdateDeliverableCategoryUnit,
	// IUpdateDeliverableCategoryUnitVariables,
} from "../../models/deliverable/query";
import { useIntl } from "react-intl";
import { CommonFormTitleFormattedMessage } from "../../utils/commonFormattedMessage";

import DeleteModal from "../DeleteModal";
import { DIALOG_TYPE } from "../../models/constants";
import {
	GoegraphiesBlockProps,
	IGeographiesBlock,
	IGeographiesBlockData,
} from "../../models/geographies/geographiesBlock";
import { IGetGeographieState } from "../../models/geographies/query";
import {
	CREATE_GEOGRAPHIES_BLOCK,
	DELETE_GEOGRAPHIES_BLOCK,
	GET_BLOCK_DATA,
	UPDATE_GEOGRAPHIES_BLOCK,
} from "../../graphql/Geographies/GeographiesBlock";

function getInitialValues(props: GoegraphiesBlockProps) {
	if (props.type === GEOGRAPHIES_ACTIONS.UPDATE) return { ...props.data };
	return {
		name: "",
		code: "",
		district: "",
		// description: "",
		// unit_type: "",
		// prefix_label: "",
		// suffix_label: "",
		// organization: props.organization,
	};
}

interface IError extends Omit<Partial<IGeographiesBlock>, "geographiesBlock"> {
	geographiesBlock?: string;
}

function GeographiesBlock(props: GoegraphiesBlockProps) {
	const notificationDispatch = useNotificationDispatch();
	const dashboardData = useDashBoardData();
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const [createBlock, { loading: createBlockLoading }] = useMutation(CREATE_GEOGRAPHIES_BLOCK, {
		refetchQueries: [{ query: GET_BLOCK_DATA }],
	});

	const [updateGeographiesBlock, { loading: updatingDeliverableUnit }] = useMutation(
		UPDATE_GEOGRAPHIES_BLOCK,
		{
			refetchQueries: [{ query: GET_BLOCK_DATA }],
		}
	);

	const [deleteGeographiesBlock] = useMutation(DELETE_GEOGRAPHIES_BLOCK, {
		refetchQueries: [{ query: GET_BLOCK_DATA }],
	});

	let initialValues: IGeographiesBlock = getInitialValues(props);
	const onCreate = async (valueSubmitted: IGeographiesBlock) => {
		const value = Object.assign({}, valueSubmitted);
		try {
			await createBlock({
				variables: { input: { data: value } },
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
						const dataRead = await store.readQuery<IGetGeographieState>({
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
						let deliverableUnits: IGeographiesBlockData[] = dataRead?.geographiesStateOrg
							? // let deliverableUnits: IDeliverableUnitData[] = dataRead?.deliverableUnitOrg
							  dataRead?.geographiesStateOrg
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
						query: GET_BLOCK_DATA,
						// variables: { filter: { organization: dashboardData?.organization?.id } },
					},
				],
			});
			notificationDispatch(setSuccessNotification("Geographies Block creation Success !"));
		} catch (error: any) {
			notificationDispatch(setErrorNotification(error.message));
		} finally {
			onCancel();
		}
	};

	const onUpdate = async (value: IGeographiesBlock) => {
		try {
			const id = value.id;

			delete value.id;
			await updateGeographiesBlock({
				variables: {
					input: {
						where: {
							id: id?.toString(),
						},
						data: value,
					},
				},
			});
			notificationDispatch(setSuccessNotification("Geographies Block updation created !"));
			onCancel();
		} catch (err: any) {
			notificationDispatch(setErrorNotification(err?.message));
			onCancel();
		}
	};

	const validate = (values: IGeographiesBlock) => {
		let errors: IError = {};
		if (!values.name && !values.name.length) {
			errors.name = "Name is required";
		}
		// if (!values.organization) {
		// 	errors.organization = "Organization is required";
		// }
		return errors;
	};

	const onDelete = async () => {
		try {
			deleteGeographiesBlock({
				variables: {
					input: {
						where: {
							id: initialValues.id,
						},
					},
				},
			});
			// await updateGeographiesBlock({
			// 	variables: {
			// 		id: initialValues?.id,
			// 		input: {
			// 			deleted: true,
			// 			...deliverableUnitValues,
			// 		},
			// 	},
			// 	refetchQueries: [
			// 		{
			// 			query: GET_DELIVERABLE_UNIT_COUNT_BY_ORG,
			// 			variables: {
			// 				filter: {
			// 					organization: dashboardData?.organization?.id,
			// 				},
			// 			},
			// 		},
			// 	],
			// });
			notificationDispatch(setSuccessNotification("Gegraphies Block Delete Success"));
		} catch (err: any) {
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
				title="Delete Geographies Block"
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
						defaultMessage: "Geographies Block",
						description: `This text will be show on deliverable unit form for title`,
					})
				}
				subtitle={intl.formatMessage({
					id: "deliverableUnitFormSubtitle",
					defaultMessage: "Manage Geographies Block data here",
					description: `This text will be show on deliverable unit form for subtitle`,
				})}
				workspace={""}
				project={""}
				open={formIsOpen}
				handleClose={onCancel}
				loading={createBlockLoading || updatingDeliverableUnit}
			>
				<CommonForm
					{...{
						initialValues,
						validate,
						onCreate,
						onCancel,
						formAction,
						onUpdate,
						inputFields: GeographiesBlockForm,
					}}
				/>
			</FormDialog>
		</React.Fragment>
	);
}

export default GeographiesBlock;
