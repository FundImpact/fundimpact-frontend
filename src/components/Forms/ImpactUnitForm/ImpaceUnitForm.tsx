import React from "react";
import { Formik, Form } from "formik";
import { Grid, TextField, Button, Box, makeStyles, createStyles, Theme } from "@material-ui/core";
import { IImpactUnitFormProps, IImpactUnitFormInput } from "../../../models/impact/impactForm";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
		},
	})
);

function ImpactUnitForm({ initialValues, validate, onSubmit, onCancel }: IImpactUnitFormProps) {
	const classes = useStyles();
	const validateInitialValue = (initialValue: IImpactUnitFormInput) => {
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
									data-testid="createImpactUnitName"
									inputProps={{
										"data-testid": "createInpactUnitNameInput",
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
									value={formik.values.prefix_label}
									style={{ width: "100%" }}
									error={
										!!formik.errors.prefix_label &&
										!!formik.touched.prefix_label
									}
									onBlur={formik.handleBlur}
									helperText={
										formik.touched.prefix_label && formik.errors.prefix_label
									}
									onChange={formik.handleChange}
									label="Prefix Label"
									data-testid="createImpactUnitPrefixLabel"
									inputProps={{
										"data-testid": "createImpactUnitPrefixLabelInput",
									}}
									required
									fullWidth
									name="prefix_label"
									variant="outlined"
									id="prefix-label"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									value={formik.values.suffix_label}
									style={{ width: "100%" }}
									error={
										!!formik.errors.suffix_label &&
										!!formik.touched.suffix_label
									}
									onBlur={formik.handleBlur}
									helperText={
										formik.touched.suffix_label && formik.errors.suffix_label
									}
									onChange={formik.handleChange}
									label="Suffix Label"
									data-testid="createImpactUnitSuffixLabel"
									inputProps={{
										"data-testid": "createImpactUnitSuffixLabelInput",
									}}
									required
									fullWidth
									name="suffix_label"
									variant="outlined"
									id="suffix-label"
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
									data-testid="createImpactUnitCode"
									inputProps={{
										"data-testid": "createImpactUnitCodeInput",
									}}
									required
									fullWidth
									name="code"
									variant="outlined"
									id="impact-code"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									style={{ width: "100%" }}
									value={formik.values.target_unit}
									error={
										!!formik.errors.target_unit && !!formik.touched.target_unit
									}
									helperText={
										formik.touched.target_unit && formik.errors.target_unit
									}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									label="Target Unit"
									data-testid="createImpactUnitTargetUnit"
									inputProps={{
										"data-testid": "createImpactUnitTargetUnitInput",
									}}
									type="number"
									required
									fullWidth
									name="target_unit"
									variant="outlined"
									id="target-unit"
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
									data-testid="createImpactUnitDescription"
									inputProps={{
										"data-testid": "createImpactUnitDescriptionInput",
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
										data-testid="createImpactUnitSaveButton"
										disabled={!formik.isValid}
									>
										Save
									</Button>
								</Box>
								<Button
									className={classes.button}
									variant="contained"
									color="secondary"
									data-testid="createImpactUnitCancelButton"
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

export default ImpactUnitForm;
