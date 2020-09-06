import { Box, Button, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";

import { IInputFields } from "../../models";
import { FORM_ACTIONS } from "../Forms/constant";
import InputFields from "../InputFields/inputField";
import { ICommonForm } from "./model";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: theme.palette.background.paper,
			marginRight: theme.spacing(2),
		},
		cancelButton: {
			marginRight: theme.spacing(2),
			padding: theme.spacing(1),
			"&:hover": {
				color: "#d32f2f !important",
			},
		},
	})
);

function CommonInputForm({
	initialValues,
	validate,
	onCreate,
	onUpdate = () => {},
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
									!element.hidden && (
										<Grid item xs={element.size} key={index}>
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
													element.selectLabelId
														? element.selectLabelId
														: ""
												}
												selectId={element.selectId ? element.selectId : ""}
												getInputValue={
													element.getInputValue
														? element.getInputValue
														: null
												}
												required={element.required ? true : false}
												multiple={
													element.multiple ? element.multiple : false
												}
												displayName={element.displayName || ""}
											/>
										</Grid>
									)
								);
							})}

							<Grid item xs={12}>
								<Box display="flex" m={1}>
									<Button className={classes.cancelButton} onClick={onCancel}>
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
