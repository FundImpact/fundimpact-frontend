import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { IImpactTargetLine, ImpactTargetLineProps } from "../../models/impact/impactTargetline";
import FullScreenLoader from "../commons/GlobalLoader";
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
import {
	GET_ANNUAL_YEARS,
	GET_FINANCIAL_YEARS,
	GET_PROJECT_DONORS,
} from "../../graphql/queries/index";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { impactTragetLineForm } from "./inputField.json";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { getTodaysDate } from "../../utils/index";
import ImpacTracklineDonorYearTags from "./impactTracklineDonor";
import Stepper from "../Stepper/Stepper";
function getInitialValues(props: ImpactTargetLineProps) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	return {
		impact_target_project: props.impactTarget,
		annual_year: "",
		value: 0,
		financial_year: "",
		reporting_date: getTodaysDate(),
		note: "",
		donors: [],
	};
}

function ImpactTrackLine(props: ImpactTargetLineProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IImpactTargetLine = getInitialValues(props);
	const { data: getAnnualYears } = useQuery(GET_ANNUAL_YEARS);

	const { data: impactFyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: DashBoardData?.organization?.country?.id } },
	});

	const { data: impactProjectDonors } = useQuery(GET_PROJECT_DONORS, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});
	const [stepperActiveStep, setStepperActiveStep] = React.useState(0);

	const { data: impactTargets } = useQuery(GET_IMPACT_TARGET_BY_PROJECT, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});

	const [donors, setDonors] = React.useState<
		{ id: string; name: string; country: { id: string; name: string } }[]
	>();
	const [createdImpactTracklineId, setCreatedImpactTracklineId] = React.useState<string>("");

	const handleNext = () => {
		setStepperActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	const handleBack = () => {
		setStepperActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
	const handleReset = () => {
		setStepperActiveStep(0);
	};
	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = () => {
		props.handleClose();
		handleReset();
	};
	const [createImpactTrackline, { loading }] = useMutation(CREATE_IMPACT_TRACKLINE, {
		onCompleted(data) {
			console.log("it", data);
			notificationDispatch(setSuccessNotification("Impact Trackline created successfully!"));
			setCreatedImpactTracklineId(data.createImpactTrackingLineitemInput.id);
			handleNext();
		},
		onError(data) {
			notificationDispatch(setErrorNotification("Impact Trackline creation Failed !"));
		},
	});

	const [updateImpactTrackLine, { loading: updateImpactTrackLineLoading }] = useMutation(
		UPDATE_IMPACT_TRACKLINE,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification("Impact Trackline Updated successfully!")
				);
				onCancel();
			},
			onError(data) {
				notificationDispatch(setErrorNotification("Impact Trackline Updation Failed !"));
			},
		}
	);

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (getAnnualYears) {
			impactTragetLineForm[4].optionsArray = getAnnualYears.annualYears;
		}
	}, [getAnnualYears]);

	// updating Impact Target field with fetched Target list
	useEffect(() => {
		if (impactTargets) {
			impactTragetLineForm[0].optionsArray = impactTargets.impactTargetProjectList;
		}
	}, [impactTargets]);

	useEffect(() => {
		if (impactProjectDonors) {
			let array: any = [];
			impactProjectDonors.projDonors.forEach(
				(elem: {
					id: string;
					donor: { id: string; name: string; country: { id: string; name: string } };
				}) => {
					array.push(elem.donor);
				}
			);
			impactTragetLineForm[3].optionsArray = array;
		}
	}, [impactProjectDonors]);

	// updating financial year field with fetched financial year list
	useEffect(() => {
		if (impactFyData) {
			impactTragetLineForm[5].optionsArray = impactFyData.financialYearList;
		}
	}, [impactFyData]);

	const onCreate = (value: IImpactTargetLine) => {
		value.reporting_date = new Date(value.reporting_date);
		console.log(`on Created is called with: `, value);
		setDonors(value.donors);
		let input = { ...value };
		delete input.donors;
		createImpactTrackline({
			variables: { input },
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
	};

	const onUpdate = (value: IImpactTargetLine) => {
		let impactTargetLineId = value.id;
		delete value.id;
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
	let basicForm = (
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
	);
	let donorForm = (
		<ImpacTracklineDonorYearTags
			donors={donors}
			impactTracklineId={createdImpactTracklineId}
			onCancel={onCancel}
			type={IMPACT_ACTIONS.CREATE}
		/>
	);
	return (
		<React.Fragment>
			<FormDialog
				title={
					(formAction === IMPACT_ACTIONS.CREATE ? "Report" : "Edit") +
					" Target Achievement"
				}
				subtitle={"Physical addresses of your organisation like headquarter branch etc"}
				workspace={DashBoardData?.workspace?.name}
				project={DashBoardData?.project?.name}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<Stepper
					stepperHelpers={{
						activeStep: stepperActiveStep,
						setActiveStep: setStepperActiveStep,
						handleNext,
						handleBack,
						handleReset,
					}}
					basicForm={basicForm}
					donorForm={donorForm}
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
			{updateImpactTrackLineLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default ImpactTrackLine;
