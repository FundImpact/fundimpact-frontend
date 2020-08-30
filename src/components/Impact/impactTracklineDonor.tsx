import React, { useEffect } from "react";
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
	CREATE_IMPACT_LINEITEM_FYDONOR,
	UPDATE_IMPACT_LINEITEM_FYDONOR,
	GET_IMPACT_LINEITEM_FYDONOR,
} from "../../graphql/queries/Impact/trackline";
import { GET_FINANCIAL_YEARS, GET_GRANT_PERIOD } from "../../graphql/queries/index";
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

const ImpacrFinancialYearAndGrantPeriodFields = ({
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
	const { data: impactFyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: donor?.donor?.country?.id } },
	});
	const { data: impactFyGrantPeriods } = useQuery(GET_GRANT_PERIOD, {
		variables: { filter: { donor: donor?.donor?.id } },
	});
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
					<InputLabel id="impact-demo-simple-select-outlined-label">
						Financial Year
					</InputLabel>

					<Select
						labelId="impact-demo-simple-select-outlined-label"
						id={"impact-demo-simple-select-outlined-1"}
						error={
							!!formik.errors[`${donor.id}mapValues`]?.financial_year &&
							!!formik.touched[`${donor.id}mapValues`]?.financial_year
						}
						value={formik.values[`${donor.id}mapValues.financial_year`]}
						onChange={(event) => {
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						required
						defaultValue={formik.values[`${donor.id}mapValues`]?.financial_year}
						label={`Financial Year`}
						name={`${donor.id}mapValues.financial_year`}
						data-testid={`ImpactTracklineFinancialYear${donor.id}`}
						inputProps={{
							"data-testid": `ImpactTracklineFinancialYearInput${donor.id}`,
						}}
					>
						{!impactFyData && (
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
						)}
						{impactFyData &&
							impactFyData.financialYearList.length > 0 &&
							impactFyData.financialYearList.map(
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
					<InputLabel id="impact-demo-simple-select-outlined-label">
						Grant Periods
					</InputLabel>

					<Select
						labelId="impact-demo-simple-select-outlined-label"
						id={"impact-demo-simple-select-outlined-1"}
						error={
							!!formik.errors[`${donor.id}mapValues`]?.grant_periods_project &&
							!!formik.touched[`${donor.id}mapValues`]?.grant_periods_project
						}
						value={formik.values[`${donor.id}mapValues.grant_periods_project`]}
						onChange={(event) => {
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						defaultValue={formik.values[`${donor.id}mapValues`]?.grant_periods_project}
						required
						label={`Grant Period`}
						name={`${donor.id}mapValues.grant_periods_project`}
						data-testid={`ImpactTracklineGrantPeriod${donor.id}`}
						inputProps={{
							"data-testid": `ImpactTracklineGrantPeriodInput${donor.id}`,
						}}
					>
						{!impactFyGrantPeriods && (
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
						)}
						{impactFyGrantPeriods &&
							impactFyGrantPeriods.impactFyGrantPeriodsProjectList.length > 0 &&
							impactFyGrantPeriods.impactFyGrantPeriodsProjectList.map(
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

function ImpactDonorYearTagForm({
	initialValues,
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
				formAction === FORM_ACTIONS.CREATE ? onCreate(values) : onUpdate(values);
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
										<ImpacrFinancialYearAndGrantPeriodFields
											{...{ donor, formik }}
										/>
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
										// disabled={!formik.isValid}
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
	let impactFyDonorinitialValuesObj: any = {};
	props.donors?.forEach(
		(elem: {
			id: string;
			name: string;
			donor: { id: string; name: string; country: { id: string; name: string } };
		}) => {
			impactFyDonorinitialValuesObj[`${elem.id}mapValues`] = {
				financial_year:
					props.organizationCountry && props.organizationCountry === elem.donor.country.id
						? props.TracklineFyId
						: "", //
				grant_periods_project: "",
				project_donor: elem.id,
				impact_tracking_lineitem: props.TracklineId,
			};
		}
	);
	return impactFyDonorinitialValuesObj;
}

function ImpactTracklineDonorYearTags(props: TracklineDonorFormProps) {
	const dashboardData = useDashBoardData();
	let organizationCountry = dashboardData?.organization?.country?.id;
	const notificationDispatch = useNotificationDispatch();
	let initialValues: any = getInitialValues({ ...props, organizationCountry });
	const [createImpactLineitemFydonor, { loading }] = useMutation(CREATE_IMPACT_LINEITEM_FYDONOR, {
		onCompleted(data) {
			notificationDispatch(
				setSuccessNotification("Impact Trackline Financial year tags created successfully!")
			);
			props.onCancel();
		},
		onError(data) {
			notificationDispatch(
				setErrorNotification("Impact Trackline Financial year tags creation Failed !")
			);
		},
	});

	const [updateImpactLineitemFydonor, { loading: updateLoading }] = useMutation(
		UPDATE_IMPACT_LINEITEM_FYDONOR,
		{
			onCompleted(data) {
				notificationDispatch(
					setSuccessNotification(
						"Impact Trackline Financial year tags updated successfully!"
					)
				);
				props.onCancel();
			},
			onError(data) {
				console.log("err", data);
				notificationDispatch(
					setErrorNotification("Impact Trackline Financial year tags updation Failed !")
				);
			},
		}
	);

	const onCreate = (value: any) => {
		console.log("formik", value);
		let impactFyDonorFinalvalues = Object.values(value);
		console.log(impactFyDonorFinalvalues);
		for (let i = 0; i < impactFyDonorFinalvalues.length; i++) {
			createImpactLineitemFydonor({
				variables: { input: impactFyDonorFinalvalues[i] },
				refetchQueries: [
					{
						query: GET_IMPACT_LINEITEM_FYDONOR,
						variables: { filter: { impact_tracking_lineitem: props.TracklineId } },
					},
				],
			});
		}
	};
	const onUpdate = (value: any) => {
		let impactFyDonorFinalvalues: any = Object.values(value);
		for (let i = 0; i < impactFyDonorFinalvalues.length; i++) {
			let deliverable_lineitem_fy_id = impactFyDonorFinalvalues[i]?.id;
			delete impactFyDonorFinalvalues[i].id;
			updateImpactLineitemFydonor({
				variables: { id: deliverable_lineitem_fy_id, input: impactFyDonorFinalvalues[i] },
				refetchQueries: [
					{
						query: GET_IMPACT_LINEITEM_FYDONOR,
						variables: { filter: { impact_tracking_lineitem: props.TracklineId } },
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
			{props.donors && (
				<ImpactDonorYearTagForm
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
			{loading ? <FullScreenLoader /> : null}
			{updateLoading ? <FullScreenLoader /> : null}
		</>
	);
}

export default ImpactTracklineDonorYearTags;
