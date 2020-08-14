import React from "react";
import { Formik, Form } from "formik";
import { Grid, TextField, Button, Box, makeStyles, createStyles, Theme } from "@material-ui/core";
import { IImpactCategoryFormProps } from "../../../models/impact/impactForm";
import { IImpactCategory } from "../../../models/impact/impact";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
		},
	})
);

function ImpaceCategoryForm({ initialValues, validate, onSubmit, onCancel }: IImpactCategoryFormProps) {
	const classes = useStyles();
	const validateInitialValue = (initialValue: IImpactCategory) => {
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
									data-testid="createImpactName"
									inputProps={{
										"data-testid": "createImpactNameInput",
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
									value={formik.values.shortname}
									style={{ width: "100%" }}
									error={!!formik.errors.shortname && !!formik.touched.shortname}
									onBlur={formik.handleBlur}
									helperText={formik.touched.shortname && formik.errors.shortname}
									onChange={formik.handleChange}
									label="Short Name"
									data-testid="createImpactShortName"
									inputProps={{
										"data-testid": "createImpactShortNameInput",
									}}
									required
									fullWidth
									name="shortname"
									variant="outlined"
									id="shortname"
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
									label="Impact Code"
									data-testid="createImpactCode"
									inputProps={{
										"data-testid": "createImpactCodeInput",
									}}
									required
									fullWidth
									name="code"
									variant="outlined"
									id="impactCode"
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
									data-testid="createImpactCategoryDescription"
									inputProps={{
										"data-testid": "createImpactCategoryDescriptionInput",
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
										data-testid="createImpactCategorySaveButton"
										disabled={!formik.isValid}
									>
										Save
									</Button>
								</Box>
								<Button
									className={classes.button}
									variant="contained"
									color="secondary"
									data-testid="createImpactCategoryCancelButton"
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

export default ImpaceCategoryForm;
