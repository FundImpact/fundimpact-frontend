import React from "react";
import { Formik, Form } from "formik";
import { Grid, Button, Box, makeStyles, createStyles, Theme } from "@material-ui/core";
import { IInputFields } from "../../models/index";
import InputFields from "../InputFields/inputField";
import { FORM_ACTIONS } from "../Forms/constant";
import { ICommonForm } from "./model";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
			marginRight: theme.spacing(2),
		},
	})
);

function CommonInputForm({
	initialValues,
	validate,
	onCreate,
	onUpdate,
	onCancel,
	inputFields,
	formAction,
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
				formAction === FORM_ACTIONS.CREATE ? onCreate(values) : onUpdate(values);
			}}
			validate={validate}
			isInitialValid={() => validateInitialValue(initialValues)}
		>
			{(formik) => {
				return (
					<Form>
						<Grid container spacing={2}>
							{inputFields.map((element: IInputFields, index: number) => {
								return (
									<Grid item xs={12} key={index}>
										<InputFields
											inputType={element.inputType}
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
											optionsArray={
												element.optionsArray ? element.optionsArray : []
											}
											inputLabelId={
												element.inputLabelId ? element.inputLabelId : ""
											}
											selectLabelId={
												element.selectLabelId ? element.selectLabelId : ""
											}
											selectId={element.selectId ? element.selectId : ""}
											getInputValue={
												element.getInputValue ? element.getInputValue : null
											}
										/>
									</Grid>
								);
							})}

							<Grid item xs={12}>
								<Box display="flex" m={1}>
									<Button
										color="primary"
										className={classes.button}
										onClick={onCancel}
										variant="contained"
									>
										Cancel
									</Button>
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
							</Grid>
						</Grid>
					</Form>
				);
			}}
		</Formik>
	);
}

export default CommonInputForm;
