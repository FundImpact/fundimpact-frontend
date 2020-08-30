import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import {
	IDeliverableTargetLine,
	DeliverableTargetLineProps,
} from "../../models/deliverable/deliverableTrackline";
import FullScreenLoader from "../commons/GlobalLoader";
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
import {
	GET_ANNUAL_YEARS,
	GET_FINANCIAL_YEARS,
	GET_PROJECT_DONORS,
} from "../../graphql/queries/index";
import FormDialog from "../FormDialog/FormDialog";
import CommonForm from "../CommonForm/commonForm";
import { deliverableTragetLineForm } from "./inputField.json";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { getTodaysDate } from "../../utils/index";
import DeliverableStepper from "../Stepper/Stepper";
import DeliverableTracklineDonorYearTags from "./DeliverableTracklineDonor";
import { FORM_ACTIONS } from "../Forms/constant";
function getInitialValues(props: DeliverableTargetLineProps) {
	if (props.type === DELIVERABLE_ACTIONS.UPDATE) return { ...props.data };
	return {
		deliverable_target_project: props.deliverableTarget,
		annual_year: "",
		value: 0,
		financial_year: "",
		reporting_date: getTodaysDate(),
		note: "",
		donors: [],
	};
}

function DeliverableTrackLine(props: DeliverableTargetLineProps) {
	const DashBoardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();
	let initialValues: IDeliverableTargetLine = getInitialValues(props);
	const { data: annualYears } = useQuery(GET_ANNUAL_YEARS);

	const { data: fyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: DashBoardData?.organization?.country?.id } },
	});

	const { data: projectDonors } = useQuery(GET_PROJECT_DONORS, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});
	const [activeStep, setActiveStep] = React.useState(0);
	const [donors, setDonors] = React.useState<
		{
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}[]
	>();

	const [donorForm, setDonorForm] = React.useState<React.ReactNode | undefined>();
	const [donorFormData, setDonorFormData] = React.useState<any>();

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};
	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};
	const handleReset = () => {
		setActiveStep(0);
	};

	const formAction = props.type;
	const formIsOpen = props.open;
	const onCancel = () => {
		props.handleClose();
		handleReset();
	};

	const { data: deliverableTargets } = useQuery(GET_DELIVERABLE_TARGET_BY_PROJECT, {
		variables: { filter: { project: DashBoardData?.project?.id } },
	});
	const [createDeliverableTrackline, { loading }] = useMutation(CREATE_DELIVERABLE_TRACKLINE, {
		onCompleted(data) {
			console.log("ssssss", data);
			setDonorForm(
				<DeliverableTracklineDonorYearTags
					donors={donors}
					TracklineId={data.createDeliverableTrackingLineitemDetail.id}
					TracklineFyId={data.createDeliverableTrackingLineitemDetail.financial_year?.id}
					onCancel={onCancel}
					type={FORM_ACTIONS.CREATE}
				/>
			);
			notificationDispatch(
				setSuccessNotification("Deliverable Trackline created successfully!")
			);
			// setCreatedDeliverableTracklineId(data.createDeliverableTrackingLineitemDetail.id);
			handleNext();
		},
		onError(data) {
			console.log("err", data);
			notificationDispatch(setErrorNotification("Deliverable Trackline creation Failed !"));
		},
	});

	const [
		updateDeliverableTrackLine,
		{ loading: updateDeliverableTrackLineLoading },
	] = useMutation(UPDATE_DELIVERABLE_TRACKLINE, {
		onCompleted(data) {
			console.log("ssssss", data);
			setDonorForm(
				<DeliverableTracklineDonorYearTags
					donors={donors}
					TracklineId={data.updateDeliverableTrackingLineitemDetail.id}
					TracklineFyId={data.updateDeliverableTrackingLineitemDetail.financial_year?.id}
					data={donorFormData}
					onCancel={onCancel}
					type={FORM_ACTIONS.UPDATE}
				/>
			);
			notificationDispatch(
				setSuccessNotification("Deliverable Trackline Updated successfully!")
			);
			handleNext();
		},
		onError(data) {
			notificationDispatch(setErrorNotification("Deliverable Trackline Updation Failed !"));
		},
	});

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (annualYears) {
			deliverableTragetLineForm[4].optionsArray = annualYears.annualYears;
		}
	}, [annualYears]);

	// updating annaul year field with fetched annual year list
	useEffect(() => {
		if (deliverableTargets) {
			deliverableTragetLineForm[0].optionsArray = deliverableTargets.deliverableTargetList;
		}
	}, [deliverableTargets]);

	// updating project_donor field with fetched project_donor  list
	useEffect(() => {
		if (projectDonors) {
			let array: any = [];
			projectDonors.projDonors.forEach(
				(elem: {
					id: string;
					donor: { id: string; name: string; country: { id: string; name: string } };
				}) => {
					array.push({ ...elem, name: elem.donor.name });
				}
			);
			deliverableTragetLineForm[3].optionsArray = array;
		}
	}, [projectDonors]);

	// updating financial year field with fetched financial year list
	useEffect(() => {
		if (fyData) {
			deliverableTragetLineForm[5].optionsArray = fyData.financialYearList;
		}
	}, [fyData]);

	const onCreate = (value: IDeliverableTargetLine) => {
		value.reporting_date = new Date(value.reporting_date);
		console.log(`on Created is called with: `, value);
		setDonors(value.donors);
		// setCreateDeliverableTracklineFyId(value.financial_year);
		let input = { ...value };
		delete input.donors;

		createDeliverableTrackline({
			variables: { input },
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
		value.reporting_date = new Date(value.reporting_date);
		console.log(`on update is called with: `, value);
		setDonors(value.donors);
		setDonorFormData(value.donorMapValues);
		let input = { ...value };
		delete input.donors;
		delete input.donorMapValues;
		updateDeliverableTrackLine({
			variables: {
				id: DeliverableTargetLineId,
				input,
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
		if (!values.deliverable_target_project) {
			errors.deliverable_target_project = "Target is required";
		}
		if (!values.reporting_date) {
			errors.reporting_date = "Date is required";
		}
		if (!values.value) {
			errors.value = "Value is required";
		}
		// if (!values.financial_year) {
		// 	errors.financial_year = "Financial Year is required";
		// }

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
				inputFields: deliverableTragetLineForm,
			}}
		/>
	);

	return (
		<React.Fragment>
			<FormDialog
				title={
					(formAction === DELIVERABLE_ACTIONS.CREATE ? "Report" : "Edit") +
					" Target Achievement"
				}
				subtitle={"Physical addresses of your organisation like headquarter branch etc"}
				workspace={DashBoardData?.workspace?.name}
				project={DashBoardData?.project?.name}
				open={formIsOpen}
				handleClose={onCancel}
			>
				<DeliverableStepper
					stepperHelpers={{
						activeStep,
						setActiveStep,
						handleNext,
						handleBack,
						handleReset,
					}}
					basicForm={basicForm}
					donorForm={donorForm}
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
			{updateDeliverableTrackLineLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default DeliverableTrackLine;
