import { Box, Button, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";

import { IInputField, ISelectField } from "../../../models";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import InputField from "../../InputField";
import SelectField from "../../SelectField";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
		},
	})
);

function CommonInputForm({
	initialValues,
	validate,
	onSubmit,
	onCancel,
	onUpdate = () => {},
	inputFields,
	selectFields = [],
	formAction = FORM_ACTIONS.CREATE,
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
				formAction == FORM_ACTIONS.CREATE ? onSubmit(values) : onUpdate(values);
			}}
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
											type={element.type ? element.type : "text"}
										/>
									</Grid>
								);
							})}

							{selectFields.map((element: ISelectField, index: number) => {
								return (
									<Grid item xs={12} key={index}>
										<SelectField
											formik={formik}
											name={element.name}
											dataTestId={element.dataTestId}
											testId={element.testId}
											label={element.label}
											optionsArray={element.optionsArray}
											inputLabelId={element.inputLabelId}
											selectLabelId={element.selectLabelId}
											selectId={element.selectId}
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
										data-testid="createSaveButton"
										disabled={!formik.isValid}
									>
										Save
									</Button>
								</Box>
								<Button
									className={classes.button}
									variant="contained"
									color="secondary"
									data-testid="createCancelButton"
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

export default CommonInputForm;
