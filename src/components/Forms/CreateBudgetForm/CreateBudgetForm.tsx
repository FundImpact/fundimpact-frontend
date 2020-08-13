import React from "react";
import { Formik, Form } from "formik";
import { Grid, TextField, Button, Box, makeStyles, createStyles, Theme } from "@material-ui/core";
import { IBudgetFormProps } from "../../../models/budget/budgetForm";
import { IBudget } from "../../../models/budget/budget";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
		},
	})
);

function CreateBudgetForm({ initialValues, validate, onSubmit, onCancel }: IBudgetFormProps) {
	const classes = useStyles();
	const validateInitialValue = (initialValue: IBudget) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validate={validate}
			isInitialValid={() => validateInitialValue(initialValues)}
		>
			{(formik) => {
				return (
					<Form>
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<TextField
									value={formik.values.name}
									style={{ width: "100%" }}
									error={!!formik.errors.name && !!formik.touched.name}
									onBlur={formik.handleBlur}
									helperText={formik.touched.name && formik.errors.name}
									onChange={formik.handleChange}
									label="Name"
									data-testid="createBudgetName"
									inputProps={{
										"data-testid": "createBudgetNameInput",
									}}
									required
									fullWidth
									name="name"
									variant="outlined"
									id="name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									style={{ width: "100%" }}
									value={formik.values.code}
									error={!!formik.errors.code && !!formik.touched.code}
									helperText={formik.touched.code && formik.errors.code}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									label="Budget Code"
									data-testid="createBudgetCode"
									inputProps={{
										"data-testid": "createBudgetCodeInput",
									}}
									required
									fullWidth
									name="code"
									variant="outlined"
									id="budgetCode"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									style={{ width: "100%" }}
									value={formik.values.description}
									error={
										!!formik.errors.description && !!formik.touched.description
									}
									helperText={
										formik.touched.description && formik.errors.description
									}
									onBlur={formik.handleBlur}
									onChange={formik.handleChange}
									label="Description"
									required
									fullWidth
									multiline
									data-testid="createBudgetDescription"
									inputProps={{
										"data-testid": "createBudgetDescriptionInput",
									}}
									rows={2}
									name="description"
									variant="outlined"
									id="description"
								/>
							</Grid>
							<Grid item xs={12}>
								<Box component="span" mr={2}>
									<Button
										disableRipple
										variant="contained"
										color="primary"
										type="submit"
										data-testid="createBudgetSaveButton"
										disabled={!formik.isValid}
									>
										Save
									</Button>
								</Box>
								<Button
									className={classes.button}
									variant="contained"
									color="secondary"
									data-testid="createBudgetCancelButton"
									disableRipple
									onClick={onCancel}
								>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
}

export default CreateBudgetForm;
