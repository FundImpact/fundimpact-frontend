import { useApolloClient, useQuery } from "@apollo/client";
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
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { GET_FINANCIAL_YEARS, GET_GRANT_PERIOD } from "../../../graphql";
import { FORM_ACTIONS } from "../constant";
import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";

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
	projectDonor,
}: {
	formik: any;
	projectDonor: {
		id: string;
		name: string;
		donor: { id: string; name: string; country: { id: string; name: string } };
	};
}) => {
	const classes = useStyles();
	const dashboardData = useDashBoardData();
	const project = dashboardData?.project?.id;

	// const { data: fyData } = useQuery(GET_FINANCIAL_YEARS, {
	// 	variables: { filter: { country: donor.donor.country?.id } },
	// });

	const { data: fyData } = useQuery(GET_FINANCIAL_YEARS);
	const { data: grantPeriods } = useQuery(GET_GRANT_PERIOD, {
		variables: { filter: { donor: projectDonor.donor.id, project: project } },
	});
	const [openGrantPeriodForm, setOpenGrantPeriodForm] = useState<boolean>();

	let noContextAvailable = (
		<FormattedMessage
			id="noContextAvailable"
			defaultMessage="No (context) available"
			description="This text will be displayed as select field for no context available"
		/>
	);
	return (
		<>
			<Grid item xs={12}>
				<Typography variant="button" display="block" gutterBottom>
					{`${projectDonor.name} Year Tags`}
				</Typography>
			</Grid>

			<Grid item xs={6}>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="demo-simple-select-outlined-label">
						<FormattedMessage
							id="TracklineDonorFinancialYearTags"
							defaultMessage="Financial Year"
							description="This text will be displayed as title for financial year on trackline donor dialog"
						/>
					</InputLabel>

					<Select
						labelId="demo-simple-select-outlined-label"
						id={"demo-simple-select-outlined-1"}
						error={
							!!formik.errors[`${projectDonor.id}mapValues`]?.financial_year &&
							!!formik.touched[`${projectDonor.id}mapValues`]?.financial_year
						}
						value={formik.values[`${projectDonor.id}mapValues.financial_year`]}
						onChange={(event) => {
							// handleFinancialYearChange(donor.id, event.target.value);
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						required
						defaultValue={formik.values[`${projectDonor.id}mapValues`]?.financial_year}
						label={`Financial Year`}
						name={`${projectDonor.id}mapValues.financial_year`}
						data-testid={`DeliverabletracklinefinancialYear${projectDonor.id}`}
						inputProps={{
							"data-testid": `DeliverabletracklinefinancialYearInput${projectDonor.id}`,
						}}
					>
						{fyData?.financialYearList.length === 0 && (
							<MenuItem value="">
								<em>{noContextAvailable}</em>
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
					<InputLabel id="demo-simple-select-outlined-label">
						<FormattedMessage
							id="TracklineDonorGrantPeriodTags"
							defaultMessage="Grant Period"
							description="This text will be displayed as title for Grant Period on trackline donor dialog"
						/>
					</InputLabel>
					<Select
						labelId="demo-simple-select-outlined-label"
						id={"demo-simple-select-outlined-1"}
						error={
							!!formik.errors[`${projectDonor.id}mapValues`]?.grant_periods_project &&
							!!formik.touched[`${projectDonor.id}mapValues`]?.grant_periods_project
						}
						value={formik.values[`${projectDonor.id}mapValues.grant_periods_project`]}
						onChange={(event) => {
							// handleGrantPeriodChange(donor.id, event.target.value);
							formik.handleChange(event);
						}}
						onBlur={formik.handleBlur}
						defaultValue={
							formik.values[`${projectDonor.id}mapValues`]?.grant_periods_project
						}
						required
						label={`Grant Period`}
						name={`${projectDonor.id}mapValues.grant_periods_project`}
						data-testid={`grantPeriod${projectDonor.id}`}
						inputProps={{
							"data-testid": `grantPeriod${projectDonor.id}`,
						}}
					>
						{grantPeriods?.grantPeriodsProjectList.length === 0 && (
							<MenuItem value="">
								<em>{noContextAvailable}</em>
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
						<MenuItem>
							<Box display="flex" onClick={() => setOpenGrantPeriodForm(true)}>
								<AddCircleIcon />
								<Box ml={1}>
									<Typography>
										<FormattedMessage
											id="addNewSelectField"
											defaultMessage="Add new"
											description="This text will be displayed as select field for add new"
										/>
									</Typography>
								</Box>
							</Box>
						</MenuItem>
					</Select>
					<FormHelperText error>
						{formik.touched[`${projectDonor.id}mapValues`]?.grant_periods_project &&
							formik.errors[`${projectDonor.id}mapValues`]?.grant_periods_project}
					</FormHelperText>
				</FormControl>
			</Grid>
			{openGrantPeriodForm && (
				<GrantPeriodDialog
					open={openGrantPeriodForm}
					onClose={() => setOpenGrantPeriodForm(false)}
					action={FORM_ACTIONS.CREATE}
				/>
			)}
		</>
	);
};

function DonorYearTagForm({
	initialValues,
	organizationCountry,
	TracklineFyId,
	formAction,
	validate,
	projectDonors,
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
							{projectDonors.map(
								(projectDonor: {
									id: string;
									name: string;
									donor: {
										id: string;
										name: string;
										country: { id: string; name: string };
									};
								}) => {
									return (
										<FinancialYearAndGrantPeriodFields
											{...{ projectDonor, formik }}
										/>
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
										<FormattedMessage
											id="cancelButtonTracklineDonorForm"
											defaultMessage="Cancel"
											description="This text will be displayed for cancel button on trackline donor form"
										/>
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
