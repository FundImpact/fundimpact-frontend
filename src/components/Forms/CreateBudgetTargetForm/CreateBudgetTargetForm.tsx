import React from "react";
import { Formik, Form } from "formik";
import {
	Grid,
	TextField,
	Button,
	Box,
	makeStyles,
	createStyles,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
} from "@material-ui/core";
import { IBudgetTargetFormProps, IBudgetTargetForm } from "../../../models/budget/budgetForm";
import { IBudget } from "../../../models/budget/budget";
import { IOrganizationCurrency } from "../../../models";
import { BUDGET_ACTIONS } from "../../../models/budget/constants";
import { IInputField } from "../../../models";
import InputField from "../../InputField";
import dataInputFields from "../../../utils/inputFields.json";

const useStyles = makeStyles(() =>
	createStyles({
		button: {
			color: "white",
		},
		formControl: {
			width: "100%",
		},
	})
);

let inputFields: IInputField[] = dataInputFields.createBudgetTargetForm;

function CreateBudgetTargetForm({
	initialValues,
	validate,
	onUpdate,
	onCreate,
	formAction,
	onCancel,
	organizationCurrencies,
	budgetCategory,
}: IBudgetTargetFormProps) {
	const classes = useStyles();
	const validateInitialValue = (initialValue: IBudgetTargetForm) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={(values: IBudgetTargetForm) =>
				formAction == BUDGET_ACTIONS.UPDATE ? onUpdate(values) : onCreate(values)
			}
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

							<Grid item xs={12} md={12}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="demo-simple-select-outlined-label">
										Choose Organization Currency
									</InputLabel>

									<Select
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined-1"
										error={
											!!formik.errors.organization_currency &&
											!!formik.touched.organization_currency
										}
										value={formik.values.organization_currency}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										label="Choose Organization Currency"
										name="organization_currency"
										data-testid="createBudgetTargetOrganizationCurrency"
										inputProps={{
											"data-testid":
												"createBudgetTargetOrganizationCurrencyOption",
										}}
									>
										{organizationCurrencies.map(
											(elem: IOrganizationCurrency, index: number) => (
												<MenuItem key={index} value={elem.id}>
													{elem.currency.name}
												</MenuItem>
											)
										)}
									</Select>
									<FormHelperText error>
										{formik.touched.organization_currency &&
											formik.errors.organization_currency}
									</FormHelperText>
								</FormControl>
							</Grid>
							<Grid item xs={12} md={12}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="demo-simple-select-outlined-label">
										Choose Budget Category
									</InputLabel>

									<Select
										labelId="demo-simple-select-outlined-label"
										id="demo-simple-select-outlined"
										error={
											!!formik.errors.budget_category_organization &&
											!!formik.touched.budget_category_organization
										}
										value={formik.values.budget_category_organization}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										label="Choose Budget Category"
										name="budget_category_organization"
										data-testid="createBudgetTargetBudgetCategory"
										inputProps={{
											"data-testid": "createBudgetTargetBudgetCategoryOption",
										}}
									>
										{budgetCategory.map((elem: IBudget, index: number) => (
											<MenuItem key={index} value={elem.id}>
												{elem.name}
											</MenuItem>
										))}
									</Select>
									<FormHelperText error>
										{formik.touched.budget_category_organization &&
											formik.errors.budget_category_organization}
									</FormHelperText>
								</FormControl>
							</Grid>

							<Grid item xs={12}>
								<Box component="span" mr={2}>
									<Button
										disableRipple
										variant="contained"
										color="primary"
										type="submit"
										data-testid="createBudgetTargetSaveButton"
										disabled={!formik.isValid}
									>
										Save
									</Button>
								</Box>
								<Button
									className={classes.button}
									variant="contained"
									color="secondary"
									data-testid="createBudgetTargetCancelButton"
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

export default CreateBudgetTargetForm;
