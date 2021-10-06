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
				color: `${theme.palette.error.dark} !important`,
			},
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
	cancelButtonName = "Cancel",
	createButtonName = "Create",
	updateButtonName = "Update",
	children,
	getFormikInstance,
	additionalButtons,
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
			onSubmit={(values: any, { resetForm }) => {
				formAction === FORM_ACTIONS.CREATE
					? onCreate(values, { resetForm })
					: onUpdate(values);
			}}
			validate={validate}
			isInitialValid={() => validateInitialValue(initialValues)}
			enableReinitialize
		>
			{(formik) => {
				{
					getFormikInstance && getFormikInstance(formik);
				}
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
												optionsLabel={
													element.optionsLabel
														? element.optionsLabel
														: undefined
												}
												optionsArray={
													element.optionsArray ? element.optionsArray : []
												}
												secondOptionsArray={
													element.secondOptionsArray
														? element.secondOptionsArray
														: []
												}
												customMenuOnClick={
													element.customMenuOnClick
														? element.customMenuOnClick
														: null
												}
												secondOptionsLabel={
													element.secondOptionsLabel
														? element.secondOptionsLabel
														: undefined
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
												logo={element.logo ? element.logo : ""}
												disabled={
													element.disabled ? element.disabled : false
												}
												autoCompleteGroupBy={
													element.autoCompleteGroupBy || undefined
												}
												onClick={element.onClick ? element.onClick : null}
												textNextToButton={
													element.textNextToButton
														? element.textNextToButton
														: undefined
												}
												addNew={element.addNew ? element.addNew : false}
												addNewClick={
													element.addNewClick ? element.addNewClick : null
												}
												helperText={element?.helperText || ""}
											/>
										</Grid>
									)
								);
							})}

							{children && (
								<Grid item xs={12}>
									{children}
								</Grid>
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
										disabled={!formik.isValid || formik.isSubmitting}
									>
										{formAction === FORM_ACTIONS.CREATE
											? createButtonName
											: updateButtonName}
									</Button>
									{additionalButtons}
									<Button
										className={classes.cancelButton}
										onClick={onCancel ? onCancel : formik.handleReset}
									>
										{cancelButtonName}
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
