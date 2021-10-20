import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { Grid, Button, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputFields from "../../InputFields/inputField";
import { ITallyForm, ITallyInputFields } from "./models";

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		btnsWrapper: {
			marginTop: theme.spacing(3),
			// position: "absolute",
			// left: theme.spacing(5),
			// bottom: theme.spacing(5),
		},
		cancelBtn: {
			marginLeft: theme.spacing(1),
			backgroundColor: theme.palette.error.main,
		},
	})
);

const TallyForm = ({
	initialValues,
	validate,
	onSubmit,
	onUpdate,
	onCancel,
	inputFields,
	formAction,
	children,
}: ITallyForm) => {
	const classes = useStyle();
	const [inputsBeforeChildren, setInputsBeforeChildren] = useState<ITallyInputFields[]>([]);
	const [inputsAfterChildren, setInputsAfterChildren] = useState<ITallyInputFields[]>([]);

	const validateInitialValues = (initialValues: any) => {
		const errors = validate(initialValues) as Object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};

	useEffect(() => {
		const inputsBefore = inputFields.filter((input) => input.position === "before");
		setInputsBeforeChildren(inputsBefore);

		const inputsAfter = inputFields.filter((input) => input.position === "after");
		setInputsAfterChildren(inputsAfter);
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validate={validate}
			isInitialValid={() => validateInitialValues(initialValues)}
			enableReinitialize
		>
			{(formik) => {
				return (
					<Form>
						<Grid container spacing={2}>
							{inputsBeforeChildren.length > 0 &&
								inputsBeforeChildren?.map(
									(value: ITallyInputFields, index: number) => {
										return (
											!value.hidden && (
												<Grid item xs={value.size} key={index}>
													<InputFields
														inputType={value.inputType}
														formik={formik}
														name={value.name}
														id={value.id}
														dataTestId={value.dataTestId}
														testId={value.testId}
														label={value.label}
														multiline={
															value.multiline
																? value.multiline
																: false
														}
														rows={value.rows ? value.rows : 1}
														type={value.type ? value.type : "text"}
														optionsLabel={
															value.optionsLabel
																? value.optionsLabel
																: undefined
														}
														optionsArray={
															value.optionsArray
																? value.optionsArray
																: []
														}
														secondOptionsArray={
															value.secondOptionsArray
																? value.secondOptionsArray
																: []
														}
														customMenuOnClick={
															value.customMenuOnClick
																? value.customMenuOnClick
																: null
														}
														secondOptionsLabel={
															value.secondOptionsLabel
																? value.secondOptionsLabel
																: undefined
														}
														inputLabelId={
															value.inputLabelId
																? value.inputLabelId
																: ""
														}
														selectLabelId={
															value.selectLabelId
																? value.selectLabelId
																: ""
														}
														selectId={
															value.selectId ? value.selectId : ""
														}
														getInputValue={
															value.getInputValue
																? value.getInputValue
																: null
														}
														required={value.required ? true : false}
														multiple={
															value.multiple ? value.multiple : false
														}
														logo={value.logo ? value.logo : ""}
														disabled={
															value.disabled ? value.disabled : false
														}
														autoCompleteGroupBy={
															value.autoCompleteGroupBy || undefined
														}
														onClick={
															value.onClick ? value.onClick : null
														}
														textNextToButton={
															value.textNextToButton
																? value.textNextToButton
																: undefined
														}
														addNew={value.addNew ? value.addNew : false}
														addNewClick={
															value.addNewClick
																? value.addNewClick
																: null
														}
														helperText={value?.helperText || ""}
													/>
												</Grid>
											)
										);
									}
								)}
						</Grid>

						{children}

						<Grid container spacing={2}>
							{inputsAfterChildren.length > 0 &&
								inputsAfterChildren?.map(
									(value: ITallyInputFields, index: number) => {
										return (
											!value.hidden && (
												<Grid item xs={value.size} key={index}>
													<InputFields
														inputType={value.inputType}
														formik={formik}
														name={value.name}
														id={value.id}
														dataTestId={value.dataTestId}
														testId={value.testId}
														label={value.label}
														multiline={
															value.multiline
																? value.multiline
																: false
														}
														rows={value.rows ? value.rows : 1}
														type={value.type ? value.type : "text"}
														optionsLabel={
															value.optionsLabel
																? value.optionsLabel
																: undefined
														}
														optionsArray={
															value.optionsArray
																? value.optionsArray
																: []
														}
														secondOptionsArray={
															value.secondOptionsArray
																? value.secondOptionsArray
																: []
														}
														customMenuOnClick={
															value.customMenuOnClick
																? value.customMenuOnClick
																: null
														}
														secondOptionsLabel={
															value.secondOptionsLabel
																? value.secondOptionsLabel
																: undefined
														}
														inputLabelId={
															value.inputLabelId
																? value.inputLabelId
																: ""
														}
														selectLabelId={
															value.selectLabelId
																? value.selectLabelId
																: ""
														}
														selectId={
															value.selectId ? value.selectId : ""
														}
														getInputValue={
															value.getInputValue
																? value.getInputValue
																: null
														}
														required={value.required ? true : false}
														multiple={
															value.multiple ? value.multiple : false
														}
														logo={value.logo ? value.logo : ""}
														disabled={
															value.disabled ? value.disabled : false
														}
														autoCompleteGroupBy={
															value.autoCompleteGroupBy || undefined
														}
														onClick={
															value.onClick ? value.onClick : null
														}
														textNextToButton={
															value.textNextToButton
																? value.textNextToButton
																: undefined
														}
														addNew={value.addNew ? value.addNew : false}
														addNewClick={
															value.addNewClick
																? value.addNewClick
																: null
														}
														helperText={value?.helperText || ""}
													/>
												</Grid>
											)
										);
									}
								)}
						</Grid>

						<Box className={classes.btnsWrapper}>
							<Button variant="contained" color="primary" type="submit">
								Save
							</Button>
							<Button
								variant="contained"
								className={classes.cancelBtn}
								onClick={() => {
									formik.resetForm();
									onCancel();
								}}
							>
								Cancel
							</Button>
						</Box>
					</Form>
				);
			}}
		</Formik>
	);
};

export default TallyForm;
