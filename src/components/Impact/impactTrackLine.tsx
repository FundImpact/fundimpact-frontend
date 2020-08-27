import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_ANNUAL_YEARS } from "../../graphql";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
} from "../../graphql/Impact/target";
import {
	CREATE_IMPACT_TRACKLINE,
	GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
	UPDATE_IMPACT_TRACKLINE,
} from "../../graphql/Impact/trackline";
import { IImpactTargetLine, ImpactTargetLineProps } from "../../models/impact/impactTargetline";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { getTodaysDate } from "../../utils";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FullScreenLoader } from "../Loader/Loader";
import { IMPACT_ACTIONS } from "./constants";
import { impactTragetLineForm } from "./inputField.json";

function getInitialValues(props: ImpactTargetLineProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		impact_target_project: props.impactTarget,
		annual_year: "",
		value: 0,
		grant_period: "",
		financial_years_org: "",
		financial_years_donor: "",
		reporting_date: getTodaysDate(),
		note: "",
	};
}

function ImpactTrackLine(props: ImpactTargetLineProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IImpactTargetLine = getInitialValues(props);
	const { data: getAnnualYears } = useQuery(GET_ANNUAL_YEARS);

	const { data: impactTargets } = useQuery(GET_IMPACT_TARGET_BY_PROJECT, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});

	const [createImpactTrackline, { loading }] = useMutation(CREATE_IMPACT_TRACKLINE, {
		onError(err) {
			console.log(err);
		},
	});

	const [updateImpactTrackLine, { loading: updateImpactTrackLineLoading }] = useMutation(
		UPDATE_IMPACT_TRACKLINE
	);

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = props.handleClose;

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (getAnnualYears) {
			impactTragetLineForm[2].optionsArray = getAnnualYears.annualYears;
		}
	}, [getAnnualYears]);

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (impactTargets) {
			impactTragetLineForm[0].optionsArray = impactTargets.impactTargetProjectList;
		}
	}, [impactTargets]);

	const onCreate = async (value: IImpactTargetLine) => {
		delete value.financial_years_donor;
		delete value.financial_years_org;
		delete value.grant_period;
		value.reporting_date = new Date(value.reporting_date);
		console.log(value);
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
			notificationDispatch(setSuccessNotification("Impact Trackline created successfully!"));
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Trackline creation Failed !"));
		}
	};

	const onUpdate = async (value: IImpactTargetLine) => {
		let impactTargetLineId = value.id;
		delete value.id;
		try {
			await updateImpactTrackLine({
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
			notificationDispatch(setSuccessNotification("Impact Trackline updated successfully !"));
			onCancel();
		} catch (error) {
			notificationDispatch(setErrorNotification("Impact Trackline Updation Failed !"));
		}
	};

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
