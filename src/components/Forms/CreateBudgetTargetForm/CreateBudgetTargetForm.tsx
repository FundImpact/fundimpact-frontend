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
							<Grid item xs={12}>
								<TextField
									value={formik.values.name}
									style={{ width: "100%" }}
									error={!!formik.errors.name && !!formik.touched.name}
									onBlur={formik.handleBlur}
									helperText={formik.touched.name && formik.errors.name}
									onChange={formik.handleChange}
									label="Name"
									data-testid="createBudgetTargetName"
									inputProps={{
										"data-testid": "createBudgetTargetNameInput",
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
									style={{ width: "100%" }}
									value={formik.values.total_target_amount}
									error={
										!!formik.errors.total_target_amount &&
										!!formik.touched.total_target_amount
									}
									helperText={
										formik.touched.total_target_amount &&
										formik.errors.total_target_amount
									}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									label="Total Taget Amount"
									data-testid="createBudgetTargetTotalTargetAmount"
									inputProps={{
										"data-testid": "createBudgetTargetTotalTargetAmountInput",
									}}
									type="number"
									required
									fullWidth
									name="total_target_amount"
									variant="outlined"
									id="total-target-amount"
								/>
							</Grid>
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
								<TextField
									style={{ width: "100%" }}
									value={formik.values.conversion_factor}
									error={
										!!formik.errors.conversion_factor &&
										!!formik.touched.conversion_factor
									}
									helperText={
										formik.touched.conversion_factor &&
										formik.errors.conversion_factor
									}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									label="Conversion Factor"
									data-testid="createBudgetTargetConversionFactor"
									inputProps={{
										"data-testid": "createBudgetTargetConversionFactorInput",
									}}
									type="number"
									required
									fullWidth
									name="conversion_factor"
									variant="outlined"
									id="conversion-factor"
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
									data-testid="createBudgetTargetDescription"
									inputProps={{
										"data-testid": "createBudgetTargetDescriptionInput",
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
