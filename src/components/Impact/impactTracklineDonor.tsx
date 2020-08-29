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
import { CREATE_IMPACT_LINEITEM_FYDONOR } from "../../graphql/queries/Impact/trackline";
import { GET_FINANCIAL_YEARS, GET_GRANT_PERIOD } from "../../graphql/queries/index";
import FullScreenLoader from "../commons/GlobalLoader";

import { IMPACT_ACTIONS } from "./constants";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
			margin: theme.spacing(1),
		},
		formControl: {
			width: "100%",
		},
	})
);

const ImpactFinancialYearAndGrantPeriodFields = ({
	formik,
	donor,
}: {
	formik: any;
	donor: { id: string; name: string; country: { id: string; name: string } };
}) => {
	const { data: impactFyData } = useQuery(GET_FINANCIAL_YEARS, {
		variables: { filter: { country: donor.country?.id } },
	});
	const { data: impactGrantPeriods } = useQuery(GET_GRANT_PERIOD, {
		variables: { filter: { donor: donor.id } },
	});

	const classes = useStyles();
	return (
		<>
			<Grid item xs={12}>
				<Typography
					variant="button"
					display="block"
					gutterBottom
					data-testid={"ImpactTracklineDonorName"}
				>
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
							!!formik.errors[`${donor.id}mapValues.financial_year`] &&
							!!formik.touched[`${donor.id}mapValues.financial_year`]
						}
						value={formik.values[`${donor.id}mapValues.financial_year`]}
						onChange={(event) => {
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						required
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
							impactFyData.financialYearList.map((elem: any, index: number) => (
								<MenuItem key={index} value={elem.id}>
									{elem.name}
								</MenuItem>
							))}
					</Select>
					<FormHelperText error>
						{formik.touched[`${donor.id}mapValues.financial_year`] &&
							formik.errors[`${donor.id}mapValues.financial_year`]}
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
							!!formik.errors[`${donor.id}mapValues.grant_periods_project`] &&
							!!formik.touched[`${donor.id}mapValues.grant_periods_project`]
						}
						value={formik.values[`${donor.id}mapValues.grant_periods_project`]}
						onChange={(event) => {
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						required
						label={`Grant Period`}
						name={`${donor.id}mapValues.grant_periods_project`}
						data-testid={`ImpactTracklineGrantPeriod${donor.id}`}
						inputProps={{
							"data-testid": `ImpactTracklineGrantPeriod${donor.id}`,
						}}
					>
						{!impactGrantPeriods && (
							<MenuItem value="">
								<em>None</em>
							</MenuItem>
						)}
						{impactGrantPeriods &&
							impactGrantPeriods.grantPeriodsProjectList.length > 0 &&
							impactGrantPeriods.grantPeriodsProjectList.map(
								(elem: any, index: number) => (
									<MenuItem key={index} value={elem.id}>
										{elem.name}
									</MenuItem>
								)
							)}
					</Select>
					<FormHelperText error>
						{formik.touched[`${donor.id}mapValues.grant_periods_project`] &&
							formik.errors[`${donor.id}mapValues.grant_periods_project`]}
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
				formAction === IMPACT_ACTIONS.CREATE ? onCreate(values) : onUpdate(values);
			}}
			validate={validate}
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
									country: { id: string; name: string };
								}) => (
									<ImpactFinancialYearAndGrantPeriodFields
										{...{ donor, formik }}
									/>
								)
							)}
							<Grid item xs={12}>
								<Box display="flex" m={1}>
									<Button
										className={classes.button}
										disableRipple
										variant="contained"
										color="secondary"
										type="submit"
										data-testid="createSaveButton"
										// disabled={!formik.isValid}
									>
										{formAction === IMPACT_ACTIONS.CREATE ? "Create" : "Update"}
									</Button>
									<Button
										color="primary"
										className={classes.button}
										onClick={onCancel}
										variant="contained"
									>
										Cancel
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

function getInitialValuess(props: any) {
	if (props.type === IMPACT_ACTIONS.UPDATE) return { ...props.data };
	let initialValuesObj: any = {};
	props.donors.forEach((elem: { id: string; name: string }) => {
		initialValuesObj[`${elem.id}mapValues`] = {
			financial_year: "",
			grant_periods_project: "",
			project_donor: elem.id,
			impact_tracking_lineitem: props.impactTracklineId,
		};
	});
	return initialValuesObj;
}

function ImpactTracklineDonorYearTags({
	donors,
	impactTracklineId,
	onCancel,
	type,
}: {
	donors: { id: string; name: string; country: { id: string; name: string } }[] | undefined;
	impactTracklineId: string;
	onCancel: () => void;
	type: IMPACT_ACTIONS;
}) {
	const notificationDispatch = useNotificationDispatch();
	let initialValues: any = getInitialValuess({ donors, impactTracklineId });
	const [createImpactLineitemFydonor, { loading }] = useMutation(CREATE_IMPACT_LINEITEM_FYDONOR, {
		onCompleted(data) {
			notificationDispatch(
				setSuccessNotification("Impact Trackline Financial year tags created successfully!")
			);
			onCancel();
		},
		onError(data) {
			notificationDispatch(
				setErrorNotification("Impact Trackline Financial year tags creation Failed !")
			);
		},
	});
	const onCreate = (value: any) => {
		console.log("formik", value);
		let finalvalues = Object.values(value);
		console.log(finalvalues);
		for (let i = 0; i < finalvalues.length; i++) {
			createImpactLineitemFydonor({
				variables: { input: finalvalues[i] },
			});
		}
	};
	const onUpdate = (value: any) => {};

	const validate = (values: any) => {
		let errors: Partial<any> = {};
		donors?.forEach(
			(elem: { id: string; name: string; country: { id: string; name: string } }) => {
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

	const formAction = type;
	return (
		<>
			{loading ? <FullScreenLoader /> : null}
			{donors && (
				<ImpactDonorYearTagForm
					{...{
						initialValues,
						donors,
						validate,
						onCancel,
						onUpdate,
						onCreate,
						formAction,
					}}
				/>
			)}
		</>
	);
}

export default ImpactTracklineDonorYearTags;
