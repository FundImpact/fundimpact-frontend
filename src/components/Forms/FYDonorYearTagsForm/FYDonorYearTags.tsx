import { useQuery } from "@apollo/client";
import {
	Box,
	Button,
	createStyles,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	Theme,
	Typography,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";

import { GET_FINANCIAL_YEARS, GET_GRANT_PERIOD } from "../../../graphql";
import { FORM_ACTIONS } from "../constant";

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
			padding: theme.spacing(1),
			"&:hover": {
				color: "#d32f2f !important",
			},
			marginRight: theme.spacing(2),
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
								<em>No (context) available</em>
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
								<em>No (context) available</em>
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
										<FinancialYearAndGrantPeriodFields {...{ donor, formik }} />
									);
								}
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
									>
										{formAction === FORM_ACTIONS.CREATE ? "Create" : "Update"}
									</Button>
									<Button className={classes.cancelButton} onClick={onCancel}>
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

export default DonorYearTagForm;
