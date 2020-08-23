import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { IImpactTargetLine, ImpactTargetLineProps } from "../../models/impact/impactTargetline";
import { FullScreenLoader } from "../Loader/Loader";
import { IMPACT_ACTIONS } from "./constants";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	CREATE_IMPACT_TRACKLINE,
	UPDATE_IMPACT_TRACKLINE,
	GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
} from "../../graphql/queries/Impact/trackline";
import {
	GET_IMPACT_TARGET_BY_PROJECT,
	GET_ACHIEVED_VALLUE_BY_TARGET,
} from "../../graphql/queries/Impact/target";
import { GET_ANNUAL_YEARS } from "../../graphql/queries/index";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { impactTragetLineForm } from "./inputField.json";
import { useDashBoardData } from "../../contexts/dashboardContext";

function getInitialValues(props: ImpactTargetLineProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		impact_target_project: props.impactTarget,
		annual_year: "",
		value: 0,
		grant_period: "",
		financial_years_org: "",
		financial_years_donor: "",
		reporting_date: "",
		note: "",
	};
}

function ImpactTrackLine(props: ImpactTargetLineProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IImpactTargetLine = getInitialValues(props);
	const { data: getAnnualYears, error: annualYearsError } = useQuery(GET_ANNUAL_YEARS);

	const { data: impactTargets, error: impactTargetsError } = useQuery(
		GET_IMPACT_TARGET_BY_PROJECT,
		{
			variables: { filter: { project: DashBoardData?.project?.id } },
		}
	);

	const [createImpactTrackline, { data: impactTracklineresponse, loading }] = useMutation(
		CREATE_IMPACT_TRACKLINE
	);

	const [
		updateImpactTrackLine,
		{ data: updateImpactTrackLineRes, loading: updateImpactTrackLineLoading },
	] = useMutation(UPDATE_IMPACT_TRACKLINE);

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (getAnnualYears) {
			impactTragetLineForm[2].optionsArray = getAnnualYears.annualYears;
		}
		if (annualYearsError) {
			notificationDispatch(setErrorNotification("Annual Year Fetching Failed !"));
		}
	}, [getAnnualYears, annualYearsError]);

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (impactTargets) {
			impactTragetLineForm[0].optionsArray = impactTargets.impactTargetProjectList;
		}
		if (impactTargetsError) {
			notificationDispatch(setErrorNotification("Targets Fetching Failed !"));
		}
	}, [impactTargets, impactTargetsError]);

	useEffect(() => {
		if (impactTracklineresponse) {
			notificationDispatch(setSuccessNotification("Impact Trackline created successfully!"));
			props.handleClose();
		}
	}, [impactTracklineresponse]);

	useEffect(() => {
		if (updateImpactTrackLineRes) {
			notificationDispatch(setSuccessNotification("Impact Trackline updated successfully !"));
			props.handleClose();
		}
	}, [updateImpactTrackLineRes]);

	const onCreate = async (value: IImpactTargetLine) => {
		delete value.financial_years_donor;
		delete value.financial_years_org;
		delete value.grant_period;
		value.reporting_date = new Date();
		console.log(`on Created is called with: `, value);
		try {
			await createImpactTrackline({
				variables: { input: value },
				refetchQueries: [
					{
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: { impact_target_project: value.impact_target_project },
						},
					},
					{
						query: GET_ACHIEVED_VALLUE_BY_TARGET,
						variables: {
							filter: { impactTargetProject: value.impact_target_project },
						},
					},
				],
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Trackline creation Failed !"));
		}
	};

	const onUpdate = (value: IImpactTargetLine) => {
		let impactTargetLineId = value.id;
		delete value.id;
		try {
			updateImpactTrackLine({
				variables: {
					id: impactTargetLineId,
					input: value,
				},
				refetchQueries: [
					{
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: { impact_target_project: value.impact_target_project },
						},
					},
					{
						query: GET_ACHIEVED_VALLUE_BY_TARGET,
						variables: {
							filter: { impactTargetProject: value.impact_target_project },
						},
					},
				],
			});
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Trackline Updation Failed !"));
		}
	};

	const clearErrors = (values: IImpactTargetLine) => {};

	const validate = (values: IImpactTargetLine) => {
		let errors: Partial<IImpactTargetLine> = {};
		if (!values.annual_year) {
			errors.annual_year = "Annual year is required";
		}
		if (!values.impact_target_project) {
			errors.impact_target_project = "Target is required";
		}
		if (!values.value) {
			errors.value = "Value is required";
		}

		return errors;
	};

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;
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
						inputFields: impactTragetLineForm,
					}}
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
			{updateImpactTrackLineLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default ImpactTrackLine;
