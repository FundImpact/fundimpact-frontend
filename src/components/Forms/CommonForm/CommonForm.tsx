import { Box, Button, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";

import { IInputField, ISelectField } from "../../../models";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import InputField from "../../InputField";
import SelectField from "../../SelectField";
import { ICommonForm } from "../../../models";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: theme.palette.background.paper,
		},
	})
);

function CommonForm({
	initialValues,
	validate,
	onSubmit,
	onCancel,
	onUpdate = () => {},
	inputFields,
	selectFields = [],
	formAction = FORM_ACTIONS.CREATE,
}: ICommonForm) {
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
				formAction === FORM_ACTIONS.CREATE ? onSubmit(values) : onUpdate(values);
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
									<Grid item xs={element.size} key={index}>
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
											endAdornment={
												element.endAdornment ? element.endAdornment : ""
											}
										/>
									</Grid>
								);
							})}

							{selectFields.map((element: ISelectField, index: number) => {
								return (
									!element.hidden && (
										<Grid item xs={element.size} key={index}>
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
									)
								);
							})}

							<Grid item xs={12}>
								<Box component="span" mr={2}>
									<Button
										className={classes.button}
										disableRipple
										variant="contained"
										color="secondary"
										type="submit"
										data-testid="createSaveButton"
										disabled={!formik.isValid}
									>
										{formAction === FORM_ACTIONS.CREATE ? "Create" : "Update"}
									</Button>
								</Box>
								<Button
									className={classes.button}
									variant="contained"
									color="primary"
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

export default CommonForm;
