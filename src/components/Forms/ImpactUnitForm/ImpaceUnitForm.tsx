import React from "react";
import { Formik, Form } from "formik";
import { Grid, TextField, Button, Box, makeStyles, createStyles, Theme } from "@material-ui/core";
import { IImpactUnitFormProps, IImpactUnitFormInput } from "../../../models/impact/impactForm";
import { IInputField } from "../../../models";
import InputField from "../../InputField";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: "white",
		},
	})
);

let inputFields: IInputField[] = [
	{
		name: "name",
		id: "name",
		dataTestId: "createImpactUnitName",
		testId: "createInpactUnitNameInput",
		label: "Name",
	},
	{
		name: "prefix_label",
		id: "prefix-label",
		dataTestId: "createImpactUnitPrefixLabel",
		testId: "createImpactUnitPrefixLabelInput",
		label: "Prefix Label",
	},
	{
		name: "suffix_label",
		id: "suffix-label",
		dataTestId: "createImpactUnitSuffixLabel",
		testId: "createImpactUnitSuffixLabelInput",
		label: "Impact Code",
	},
	{
		name: "code",
		id: "impact-code",
		dataTestId: "createImpactUnitCode",
		testId: "createImpactUnitCodeInput",
		label: "Suffix Label",
	},
	{
		name: "target_unit",
		id: "target-unit",
		dataTestId: "createImpactUnitTargetUnit",
		testId: "createImpactUnitTargetUnitInput",
		label: "Target Unit",
		type: "number",
	},
	{
		name: "description",
		id: "description",
		dataTestId: "createImpactUnitDescription",
		testId: "createImpactUnitDescriptionInput",
		label: "Description",
		rows: 2,
		multiline: true,
	},
];

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
