import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { GET_ANNUAL_YEARS, GET_FINANCIAL_YEARS, GET_PROJECT_DONORS } from "../../graphql";
import {
	GET_IMPACT_TARGET_BY_PROJECT,
	GET_ACHIEVED_VALLUE_BY_TARGET,
} from "../../graphql/Impact/target";
import {
	CREATE_IMPACT_TRACKLINE,
	GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
	UPDATE_IMPACT_TRACKLINE,
	GET_IMPACT_TRACKLINE_COUNT,
} from "../../graphql/Impact/trackline";
import { IImpactTargetLine, ImpactTargetLineProps } from "../../models/impact/impactTargetline";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import { getTodaysDate } from "../../utils";
import CommonForm from "../CommonForm/commonForm";
import FormDialog from "../FormDialog/FormDialog";
import { FORM_ACTIONS } from "../Forms/constant";
import { FullScreenLoader } from "../Loader/Loader";
import Stepper from "../Stepper/Stepper";
import { IMPACT_ACTIONS } from "./constants";
import ImpacTracklineDonorYearTags from "./impactTracklineDonor";
import { impactTragetLineForm } from "./inputField.json";

// import FullScreenLoader from "../commons/GlobalLoader";
// import { IMPACT_ACTIONS } from "./constants";
// import { GET_ANNUAL_YEARS } from "../../graphql";
// import {
// 	GET_ACHIEVED_VALLUE_BY_TARGET,
// 	GET_IMPACT_TARGET_BY_PROJECT,
// } from "../../graphql/Impact/target";

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
		{
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}[]
	>();
	const [impactDonorForm, setImpactDonorForm] = React.useState<React.ReactNode | undefined>();
	const [impactDonorFormData, setImpactDonorFormData] = React.useState<any>();
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
			setImpactDonorForm(
				<ImpacTracklineDonorYearTags
					donors={donors}
					TracklineId={data.createImpactTrackingLineitemInput.id}
					TracklineFyId={data.createImpactTrackingLineitemInput.financial_year?.id}
					onCancel={onCancel}
					type={FORM_ACTIONS.CREATE}
				/>
			);
			notificationDispatch(setSuccessNotification("Impact Trackline created successfully!"));
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
				setImpactDonorForm(
					<ImpacTracklineDonorYearTags
						donors={donors}
						TracklineId={data.updateImpactTrackingLineitemInput.id}
						TracklineFyId={data.updateImpactTrackingLineitemInput.financial_year?.id}
						onCancel={onCancel}
						data={Object.keys(impactDonorFormData).length ? impactDonorFormData : {}}
						type={
							Object.keys(impactDonorFormData).length
								? FORM_ACTIONS.UPDATE
								: FORM_ACTIONS.CREATE
						}
					/>
				);
				notificationDispatch(
					setSuccessNotification("Impact Trackline Updated successfully!")
				);
				handleNext();
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
			console.log(impactTargets);
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
					array.push({ ...elem, name: elem.donor.name });
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
		setDonors(value.donors);
		let input = { ...value };
		delete input.donors;
		createImpactTrackline({
			variables: { input },
			update: async (
				store,
				{ data: { createImpactTrackingLineitemInput: tracklineCreated } }
			) => {
				try {
					const count = await store.readQuery<{
						impactTrackingLineitemListCount: number;
					}>({
						query: GET_IMPACT_TRACKLINE_COUNT,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
						},
					});

					store.writeQuery<{ impactTrackingLineitemListCount: number }>({
						query: GET_IMPACT_TRACKLINE_COUNT,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
						},
						data: {
							impactTrackingLineitemListCount:
								count!.impactTrackingLineitemListCount + 1,
						},
					});

					let limit = 0;
					if (count) {
						limit = count.impactTrackingLineitemListCount;
					}
					const dataRead = await store.readQuery<any>({
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
							limit: limit > 10 ? 10 : limit,
							start: 0,
							sort: "created_at:DESC",
						},
					});
					let impactTrackingLineitemList: any[] = dataRead?.impactTrackingLineitemList
						? dataRead?.impactTrackingLineitemList
						: [];

					store.writeQuery<any>({
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
							limit: limit > 10 ? 10 : limit,
							start: 0,
							sort: "created_at:DESC",
						},
						data: {
							impactTrackingLineitemList: [
								...impactTrackingLineitemList,
								tracklineCreated,
							],
						},
					});

					store.writeQuery<any>({
						query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
						variables: {
							filter: {
								impact_target_project: value.impact_target_project,
							},
						},
						data: {
							impactTrackingLineitemList: [
								...impactTrackingLineitemList,
								tracklineCreated,
							],
						},
					});
				} catch (err) {}
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

	const onUpdate = (value: IImpactTargetLine) => {
		let impactTargetLineId = value.id;
		delete value.id;
		value.reporting_date = new Date(value.reporting_date);
		setDonors(value.donors);
		setImpactDonorFormData(value.impactDonorMapValues);
		let input = { ...value };
		delete input.donors;
		delete input.impactDonorMapValues;
		updateImpactTrackLine({
			variables: {
				id: impactTargetLineId,
				input,
			},
			refetchQueries: [
				{
					query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
					variables: {
						limit: 10,
						start: 0,
						sort: "created_at:DESC",
						filter: { impact_target_project: value.impact_target_project },
					},
				},
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
		if (!values.impact_target_project) {
			errors.impact_target_project = "Target is required";
		}
		if (!values.reporting_date) {
			errors.reporting_date = "Date is required";
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
					donorForm={impactDonorForm}
				/>
			</FormDialog>
			{loading ? <FullScreenLoader /> : null}
			{updateImpactTrackLineLoading ? <FullScreenLoader /> : null}
		</React.Fragment>
	);
}

export default ImpactTrackLine;
