import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import {
	IDeliverableTargetLine,
	DeliverableTargetLineProps,
} from "../../models/deliverable/deliverableTrackline";
import { FullScreenLoader } from "../Loader/Loader";
import { DELIVERABLE_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	CREATE_DELIVERABLE_TRACKLINE,
	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
	UPDATE_DELIVERABLE_TRACKLINE,
} from "../../graphql/queries/Deliverable/trackline";
import {
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	GET_ACHIEVED_VALLUE_BY_TARGET,
} from "../../graphql/queries/Deliverable/target";
import { GET_ANNUAL_YEARS } from "../../graphql/queries/index";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { deliverableTragetLineForm } from "./inputField.json";
// import { GET_FINANCIAL_YEARS_ORG } from "../../graphql/queries/financialYears";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { getTodaysDate } from "../../utils/index";

function getInitialValues(props: DeliverableTargetLineProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		deliverable_target_project: props.deliverableTarget,
		annual_year: "",
		value: 0,
		grant_period: "",
		financial_years_org: "",
		financial_years_donor: "",
		reporting_date: getTodaysDate(),
		note: "",
	};
}

function DeliverableTrackLine(props: DeliverableTargetLineProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IDeliverableTargetLine = getInitialValues(props);
	const { data: annualYears } = useQuery(GET_ANNUAL_YEARS);

	// const { data: fYOrg, error: fYOrgError } = useQuery(GET_FINANCIAL_YEARS_ORG, {
	// 	variables: { filter: { organization: DashBoardData?.organization?.id } },
	// });

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	const { data: deliverableTargets } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});

	const [createDeliverableTrackline, { loading }] = useMutation(CREATE_DELIVERABLE_TRACKLINE, {
		onCompleted(data) {
			notificationDispatch(
				setSuccessNotification("Deliverable Trackline created successfully!")
			);
			onCancel();
		},
		onError(data) {
			notificationDispatch(setErrorNotification("Deliverable Trackline creation Failed !"));
		},
	});

	const [
		updateDeliverableTrackLine,
		{ loading: updateDeliverableTrackLineLoading },
	] = useMutation(UPDATE_DELIVERABLE_TRACKLINE, {
		onCompleted(data) {
			notificationDispatch(
				setSuccessNotification("Deliverable Trackline Updated successfully!")
			);
			onCancel();
		},
		onError(data) {
			notificationDispatch(setErrorNotification("Deliverable Trackline Updation Failed !"));
		},
	});

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (annualYears) {
			deliverableTragetLineForm[2].optionsArray = annualYears.annualYears;
		}
	}, [annualYears]);

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (deliverableTargets) {
			deliverableTragetLineForm[0].optionsArray = deliverableTargets.deliverableTargetList;
		}
	}, [deliverableTargets]);

	// updating annaul year field with fetched annual year list
	// useEffect(() => {
	// 	if (fYOrg) {
	// 		deliverableTragetLineForm[2].optionsArray = fYOrg.financialYearsOrgList;
	// 	}
	// 	if (fYOrgError) {
	// 		notificationDispatch(setErrorNotification("Financial Years Org Fetching Failed !"));
	// 	}
	// }, [fYOrg, fYOrgError]);

	const onCreate = (value: IDeliverableTargetLine) => {
		console.log(`on Created is called with: `, value);
		delete value.financial_years_donor;
		delete value.financial_years_org;
		delete value.grant_period;
		value.reporting_date = new Date(value.reporting_date);
		console.log(`on Created is called with: `, value);

		createDeliverableTrackline({
			variables: { input: value },
			refetchQueries: [
				{
					query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
					variables: {
						filter: {
							deliverable_target_project: value.deliverable_target_project,
						},
					},
				},
				{
					query: GET_ACHIEVED_VALLUE_BY_TARGET,
					variables: {
						filter: { deliverableTargetProject: value.deliverable_target_project },
					},
				},
			],
		});
	};

	const onUpdate = (value: IDeliverableTargetLine) => {
		let DeliverableTargetLineId = value.id;
		delete value.id;
		updateDeliverableTrackLine({
			variables: {
				id: DeliverableTargetLineId,
				input: value,
			},
			refetchQueries: [
				{
					query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
					variables: {
						filter: {
							deliverable_target_project: value.deliverable_target_project,
						},
					},
				},
				{
					query: GET_ACHIEVED_VALLUE_BY_TARGET,
					variables: {
						filter: { deliverableTargetProject: value.deliverable_target_project },
					},
				},
			],
		});
	};

	const validate = (values: IDeliverableTargetLine) => {
		let errors: Partial<IDeliverableTargetLine> = {};
		if (!values.annual_year) {
			errors.annual_year = "Annual year is required";
		}

		return errors;
	};

	return (
		<React.Fragment>
			<FormDialog
				title={"Report Achievement"}
				subtitle={"Manage Targets"}
				workspace={"workspace"}
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
						inputFields: deliverableTragetLineForm,
					}}
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
			{updateDeliverableTrackLineLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default DeliverableTrackLine;
