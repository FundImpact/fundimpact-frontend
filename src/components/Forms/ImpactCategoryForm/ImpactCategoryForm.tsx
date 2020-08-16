import React from "react";
import { Formik, Form } from "formik";
import { Grid, TextField, Button, Box, makeStyles, createStyles, Theme } from "@material-ui/core";
import { IImpactCategoryFormProps } from "../../../models/impact/impactForm";
import { IImpactCategory } from "../../../models/impact/impact";
import { IInputField } from "../../../models";
import InputField from "../../InputField";
import dataInputFields from "../../../utils/inputFields.json";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
		},
	})
);

let inputFields: IInputField[] = dataInputFields.impactCategoryForm;

function ImpaceCategoryForm({
	initialValues,
	validate,
	onSubmit,
	onCancel,
}: IImpactCategoryFormProps) {
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
							{inputFields.map((element: IInputField, index: number) => {
								return (
									<Grid item xs={12} key={index}>
										<InputField
											formik={formik}
											name={element.name}
											id={element.id}
											dataTestId={element.dataTestId}
											testId={element.testId}
											label={element.label}
											multiline={
												element.multiline ? element.multiline : false
											}
											rows={element.rows ? element.rows : 1}
										/>
									</Grid>
								);
							})}
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
