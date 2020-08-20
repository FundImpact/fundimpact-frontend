import { makeStyles } from "@material-ui/core/styles";
import { Button, createStyles, Grid, TextField, Theme } from "@material-ui/core";
import { IOrganisation } from "../../../models";
import { useNavigate } from "react-router-dom";
import { Form, Formik, FormikHelpers } from "formik";
import { SignUpSteps } from "../../../utils/signup.util";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			display: "flex",
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				spacing: 1,
			},
		},
	})
);

export default function OrganisationForm() {
	const initialValues: IOrganisation = {
		orgName: "",
		streetAdd: "",
		city: "",
		state: "",
		country: "",
		zipCode: null,
	};
	const classes = useStyles();
	const navigate = useNavigate();

	function onSubmit(values: IOrganisation, formikHelpers: FormikHelpers<IOrganisation>) {
		console.log(values, formikHelpers);
		navigate(`/signup/${SignUpSteps.SET_PROJECT}`);
	}

	return (
		<Formik initialValues={initialValues} onSubmit={onSubmit}>
			{(formik) => {
				return (
					<Form className={classes.form}>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<TextField
									error={!!formik.errors.orgName}
									helperText={formik.touched.orgName && formik.errors.orgName}
									onChange={formik.handleChange}
									label="Organization Name"
									required
									fullWidth
									name="orgName"
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									error={!!formik.errors.streetAdd}
									helperText={formik.touched.streetAdd && formik.errors.streetAdd}
									onChange={formik.handleChange}
									label="Stree Address"
									required
									fullWidth
									name="streetAdd"
									variant="outlined"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									style={{ width: "100%" }}
									error={!!formik.errors.city}
									helperText={formik.touched.city && formik.errors.city}
									onChange={formik.handleChange}
									label="email"
									required
									fullWidth
									name="city"
									variant="outlined"
									type={"email"}
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									style={{ width: "100%" }}
									error={!!formik.errors.state}
									helperText={formik.touched.state && formik.errors.state}
									onChange={formik.handleChange}
									label="State"
									required
									fullWidth
									name="state"
									variant="outlined"
									type="text"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									style={{ width: "100%" }}
									error={!!formik.errors.country}
									helperText={formik.touched.country && formik.errors.country}
									onChange={formik.handleChange}
									label="Country"
									required
									fullWidth
									name="country"
									variant="outlined"
									type="text"
								/>
							</Grid>
							<Grid item xs={12} md={6}>
								<TextField
									style={{ width: "100%" }}
									error={!!formik.errors.zipCode}
									helperText={formik.touched.zipCode && formik.errors.zipCode}
									onChange={formik.handleChange}
									label="ZipCode"
									required
									fullWidth
									name="zipCode"
									variant="outlined"
									type="number"
								/>
							</Grid>
							<Grid item xs={12}>
								<Button
									fullWidth
									disabled={formik.isSubmitting || !formik.isValid}
									type="submit"
									variant="contained"
									color="primary"
								>
									Submit
								</Button>
							</Grid>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
}
