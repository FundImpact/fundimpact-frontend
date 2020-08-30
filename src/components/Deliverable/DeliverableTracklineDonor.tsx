import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Formik, Form } from "formik";
import {
	Grid,
	Button,
	Box,
	makeStyles,
	createStyles,
	Theme,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	Typography,
} from "@material-ui/core";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { setErrorNotification, setSuccessNotification } from "../../reducers/notificationReducer";
import {
	CREATE_DELIVERABLE_LINEITEM_FYDONOR,
	UPDATE_DELIVERABLE_LINEITEM_FYDONOR,
	GET_DELIVERABLE_LINEITEM_FYDONOR,
} from "../../graphql/queries/Deliverable/trackline";
import { GET_FINANCIAL_YEARS, GET_GRANT_PERIOD } from "../../graphql/queries/index";
import { DELIVERABLE_ACTIONS } from "./constants";
import FullScreenLoader from "../commons/GlobalLoader";
import { useDashBoardData } from "../../contexts/dashboardContext";
import { TracklineDonorFormProps } from "../../models/TracklineDonor/tracklineDonor";
import { FORM_ACTIONS } from "../Forms/constant";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
			margin: theme.spacing(1),
		},
		formControl: {
			width: "100%",
		},
		cancelButton: {
			marginRight: theme.spacing(2),
			padding: theme.spacing(1),
			"&:hover": {
				color: "#d32f2f !important",
			},
		},
	})
);

const FinancialYearAndGrantPeriodFields = ({
	formik,
	donor,
}: {
	formik: any;
	donor: {
		id: string;
		name: string;
		donor: { id: string; name: string; country: { id: string; name: string } };
	};
}) => {
	const { data: fyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: donor.donor.country?.id } },
	});
	const { data: grantPeriods } = useQuery(GET_GRANT_PERIOD, {
		variables: { filter: { donor: donor.donor.id } },
	});
	console.log("formikV", formik.values);
	const classes = useStyles();
	return (
		<>
			<Grid item xs={12}>
				<Typography variant="button" display="block" gutterBottom>
					{`${donor.name} Year Tags`}
				</Typography>
			</Grid>

			<Grid item xs={6}>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="demo-simple-select-outlined-label">Financial Year</InputLabel>

					<Select
						labelId="demo-simple-select-outlined-label"
						id={"demo-simple-select-outlined-1"}
						error={
							!!formik.errors[`${donor.id}mapValues`]?.financial_year &&
							!!formik.touched[`${donor.id}mapValues`]?.financial_year
						}
						value={formik.values[`${donor.id}mapValues.financial_year`]}
						onChange={(event) => {
							// handleFinancialYearChange(donor.id, event.target.value);
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						required
						defaultValue={formik.values[`${donor.id}mapValues`]?.financial_year}
						label={`Financial Year`}
						name={`${donor.id}mapValues.financial_year`}
						data-testid={`DeliverabletracklinefinancialYear${donor.id}`}
						inputProps={{
							"data-testid": `DeliverabletracklinefinancialYearInput${donor.id}`,
						}}
					>
						{!fyData && (
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
						)}
						{fyData &&
							fyData.financialYearList.length > 0 &&
							fyData.financialYearList.map(
								(elem: { id: string; name: string }, index: number) => (
									<MenuItem key={index} value={elem.id}>
										{elem.name}
									</MenuItem>
								)
							)}
					</Select>
					<FormHelperText error>
						{formik.touched.financialYear && formik.errors.financialYear}
					</FormHelperText>
				</FormControl>
			</Grid>
			<Grid item xs={6}>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="demo-simple-select-outlined-label">Grant Periods</InputLabel>

					<Select
						labelId="demo-simple-select-outlined-label"
						id={"demo-simple-select-outlined-1"}
						error={
							!!formik.errors[`${donor.id}mapValues`]?.grant_periods_project &&
							!!formik.touched[`${donor.id}mapValues`]?.grant_periods_project
						}
						value={formik.values[`${donor.id}mapValues.grant_periods_project`]}
						onChange={(event) => {
							// handleGrantPeriodChange(donor.id, event.target.value);
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						defaultValue={formik.values[`${donor.id}mapValues`]?.grant_periods_project}
						required
						label={`Grant Period`}
						name={`${donor.id}mapValues.grant_periods_project`}
						data-testid={`grantPeriod${donor.id}`}
						inputProps={{
							"data-testid": `grantPeriod${donor.id}`,
						}}
					>
						{!grantPeriods && (
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
						)}
						{grantPeriods &&
							grantPeriods.grantPeriodsProjectList.length > 0 &&
							grantPeriods.grantPeriodsProjectList.map(
								(elem: { id: string; name: string }, index: number) => (
									<MenuItem key={index} value={elem.id}>
										{elem.name}
									</MenuItem>
								)
							)}
					</Select>
					<FormHelperText error>
						{formik.touched[`${donor.id}mapValues`]?.grant_periods_project &&
							formik.errors[`${donor.id}mapValues`]?.grant_periods_project}
					</FormHelperText>
				</FormControl>
			</Grid>
		</>
	);
};

function DonorYearTagForm({
	initialValues,
	organizationCountry,
	TracklineFyId,
	formAction,
	validate,
	donors,
	onCreate,
	onUpdate,
	onCancel,
}: any) {
	const classes = useStyles();

	const validateInitialValue = (initialValue: any) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={(values: any) => {
				formAction === DELIVERABLE_ACTIONS.CREATE ? onCreate(values) : onUpdate(values);
			}}
			// validate={validate}
			isInitialValid={() => validateInitialValue(initialValues)}
		>
			{(formik) => {
				return (
					<Form>
						<Grid container spacing={2}>
							{donors.map(
								(donor: {
									id: string;
									name: string;
									donor: {
										id: string;
										name: string;
										country: { id: string; name: string };
									};
								}) => {
									return (
										<FinancialYearAndGrantPeriodFields {...{ donor, formik }} />
									);
								}
							)}
							<Grid item xs={12}>
								<Box display="flex" m={1}>
									<Button className={classes.cancelButton} onClick={onCancel}>
										Cancel
									</Button>
									<Button
										className={classes.button}
										disableRipple
										variant="contained"
										color="secondary"
										type="submit"
										data-testid="createSaveButton"
										disabled={!formik.isValid}
									>
										{formAction === FORM_ACTIONS.CREATE ? "Create" : "Update"}
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
}

function getInitialValues(props: TracklineDonorFormProps) {
	if (props.type === FORM_ACTIONS.UPDATE) return { ...props.data };
	let initialValuesObj: any = {};
	props.donors?.forEach(
		(elem: {
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}) => {
			initialValuesObj[`${elem.id}mapValues`] = {
				financial_year:
					props.organizationCountry && props.organizationCountry === elem.donor.country.id
						? props.TracklineFyId
						: "", //
				grant_periods_project: "",
				project_donor: elem.id,
				deliverable_tracking_lineitem: props.TracklineId,
			};
		}
	);
	return initialValuesObj;
}

function DeliverableTracklineDonorYearTags(props: TracklineDonorFormProps) {
	const dashboardData = useDashBoardData();
	let organizationCountry = dashboardData?.organization?.country?.id;
	const notificationDispatch = useNotificationDispatch();
	let initialValues: any = getInitialValues({ ...props, organizationCountry });
	const [createDeliverableLineitemFydonor, { loading }] = useMutation(
		CREATE_DELIVERABLE_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Deliverable Trackline Financial year tags created successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				notificationDispatch(
					setErrorNotification(
						"Deliverable Trackline Financial year tags creation Failed !"
					)
				);
			},
		}
	);

	const [updateDeliverableLineitemFydonor, { loading: updateLoading }] = useMutation(
		UPDATE_DELIVERABLE_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Deliverable Trackline Financial year tags updated successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				console.log("err", data);
				notificationDispatch(
					setErrorNotification(
						"Deliverable Trackline Financial year tags updation Failed !"
					)
				);
			},
		}
	);

	const onCreate = (value: any) => {
		console.log("formik", value);
		let finalvalues = Object.values(value);
		console.log(finalvalues);
		for (let i = 0; i < finalvalues.length; i++) {
			createDeliverableLineitemFydonor({
				variables: { input: finalvalues[i] },
				refetchQueries: [
					{
						query: GET_DELIVERABLE_LINEITEM_FYDONOR,
						variables: { filter: { deliverable_tracking_lineitem: props.TracklineId } },
					},
				],
			});
		}
	};
	const onUpdate = (value: any) => {
		let finalvalues: any = Object.values(value);
		for (let i = 0; i < finalvalues.length; i++) {
			let deliverable_lineitem_fy_id = finalvalues[i]?.id;
			delete finalvalues[i].id;
			updateDeliverableLineitemFydonor({
				variables: { id: deliverable_lineitem_fy_id, input: finalvalues[i] },
				refetchQueries: [
					{
						query: GET_DELIVERABLE_LINEITEM_FYDONOR,
						variables: { filter: { deliverable_tracking_lineitem: props.TracklineId } },
					},
				],
			});
		}
	};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		props.donors?.forEach(
			(elem: {
				id: string;
				name: string;
				donor: { id: string; name: string; country: { id: string; name: string } };
			}) => {
				if (!values[`${elem.id}mapValues.financial_year`]) {
					errors[`${elem.id}mapValues`] = {};
					errors[`${elem.id}mapValues.financial_year`] = "Financial Year is required";
				}
				if (!values[`${elem.id}mapValues.grant_periods_project`]) {
					errors[`${elem.id}mapValues`] = {};
					errors[`${elem.id}mapValues.grant_periods_project`] =
						"Grant Period is required";
				}
			}
		);

		return errors;
	};

	const formAction = props.type;
	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
			{props.donors && (
				<DonorYearTagForm
					{...{
						initialValues,
						donors: props.donors,
						TracklineFyId: props.TracklineFyId,
						organizationCountry,
						validate,
						onCancel: props.onCancel,
						onUpdate,
						onCreate,
						formAction,
					}}
				/>
			)}
		</>
	);
}

export default DeliverableTracklineDonorYearTags;
