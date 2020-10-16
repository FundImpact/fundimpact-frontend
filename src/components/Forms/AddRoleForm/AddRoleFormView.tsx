import React, { useCallback } from "react";
import {
	Grid,
	Box,
	CircularProgress,
	TextField,
	Button,
	makeStyles,
	Theme,
	Typography,
	FormControl,
	FormControlLabel,
	FormGroup,
	Checkbox,
} from "@material-ui/core";
import { IAddRole, IControllerAction, IAddRolePermissions } from "../../../models/AddRole";
import { FormikState, Formik, Form, FormikProps } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import { MODULE_CODES } from "../../../utils/access";
import { compareObjectKeys } from "../../../utils";
import { FORM_ACTIONS } from "../constant";

interface IControllerActionsFormProps {
	controllerAction: { [key: string]: { enabled: boolean; policy: "" } };
	name: MODULE_CODES;
	formik: FormikProps<IAddRole>;
}

const useStyles = makeStyles((theme: Theme) => ({
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
	subHeading: {
		fontWeight: theme.typography.fontWeightMedium,
	},
}));

const compareProps = (
	previousProps: IControllerActionsFormProps,
	newProps: IControllerActionsFormProps
) => {
	if (
		!(previousProps.name in previousProps.formik.values.permissions) ||
		!(newProps.name in newProps.formik.values.permissions)
	) {
		return false;
	}
	return compareObjectKeys(
		(previousProps.formik.values.permissions as IAddRolePermissions)[previousProps.name],
		(newProps.formik.values.permissions as IAddRolePermissions)[newProps.name]
	);
};

const ControllerActionsForm: React.SFC<IControllerActionsFormProps> = React.memo(
	({ controllerAction, name, formik }) => {
		const classes = useStyles();
		const intl = useIntl();
		return (
			<Grid container>
				<Grid item xs={12}>
					<Box mt={1}>
						<Typography className={classes.subHeading}>
							{intl.formatMessage({
								id: `${name}`,
								defaultMessage: `${name.toLocaleUpperCase()}`,
								description: `This text will be show as a heading of controller`,
							})}
						</Typography>
						<Box pl={1} mt={1}>
							<Grid container>
								<FormControl component="fieldset" fullWidth>
									<FormGroup
										aria-label="organization_registration_type"
										data-testid="createOrganizationRegistrationType"
										style={{ flexDirection: "row" }}
									>
										{Object.keys(controllerAction).map(
											(action: string, index) => (
												<Grid item xs={4}>
													<FormControlLabel
														key={index}
														control={
															<Checkbox
																color="primary"
																checked={
																	name in
																		formik.values.permissions &&
																	(formik.values
																		.permissions as IAddRolePermissions)[
																		name
																	][action]
																}
																name={`permissions.${name}.${action}`}
																onChange={formik.handleChange}
																onBlur={formik.handleBlur}
															/>
														}
														label={intl.formatMessage({
															id: `${name}-${action}`,
															defaultMessage: `${action}`,
															description: `This text will be show as controller action`,
														})}
													/>
												</Grid>
											)
										)}
									</FormGroup>
								</FormControl>
							</Grid>
						</Box>
					</Box>
				</Grid>
			</Grid>
		);
	},
	compareProps
);

function AddRoleView({
	initialValues,
	validate,
	onCreate,
	roleCreationLoading,
	controllerActionHash,
	formType,
	onCancel,
}: {
	initialValues: IAddRole;
	validate: (values: IAddRole) => Partial<IAddRole>;
	onCreate: (
		valuesSubmitted: IAddRole,
		{
			resetForm,
		}: {
			resetForm?: (nextState?: Partial<FormikState<any>> | undefined) => void;
		}
	) => Promise<void>;
	roleCreationLoading: boolean;
	controllerActionHash: {} | IControllerAction;
	formType: FORM_ACTIONS;
	onCancel: () => void;
}) {
	const classes = useStyles();
	const validateInitialValue = useCallback(
		(initialValue: any) => {
			const errors = validate(initialValue) as object;
			if (!errors) return true;
			return Object.keys(errors).length ? false : true;
		},
		[validate]
	);
	return (
		<Grid container>
			<Grid item xs={12}>
				<Formik
					initialValues={initialValues}
					onSubmit={(values, { resetForm }) => onCreate(values, { resetForm })}
					validate={validate}
					isInitialValid={() => validateInitialValue(initialValues)}
					enableReinitialize
				>
					{(formik) => (
						<Form>
							<Grid container spacing={2}>
								<Grid item xs={12}>
									<TextField
										value={formik.values.name}
										error={!!formik.errors.name && !!formik.touched.name}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										fullWidth
										label={"Role"}
										required={true}
										inputProps={{
											"data-testid": "addRoleFormInput",
										}}
										name={"name"}
										data-testid={"addRoleForm"}
										variant="outlined"
										helperText={formik.touched.name && formik.errors.name}
									/>
								</Grid>
								<Grid item xs={12}>
									{(Object.keys(controllerActionHash) as MODULE_CODES[]).map(
										(controllerName: MODULE_CODES, index) => (
											<ControllerActionsForm
												key={index}
												name={controllerName}
												controllerAction={
													(controllerActionHash as IControllerAction)[
														controllerName
													]
												}
												formik={formik}
											/>
										)
									)}
								</Grid>
								<Grid item xs={12}>
									<Box display="flex">
										<Button
											className={classes.button}
											disableRipple
											variant="contained"
											color="secondary"
											type="submit"
											data-testid="createSaveButton"
											disabled={!formik.isValid}
										>
											<FormattedMessage
												id="addRoleButton"
												defaultMessage={`${
													formType == FORM_ACTIONS.CREATE
														? "Add"
														: "Update"
												} Role`}
												description="This text will tell user to create role"
											/>
										</Button>
										<Button className={classes.cancelButton} onClick={onCancel}>
											<FormattedMessage
												id="cancelButton"
												defaultMessage="Cancel"
												description="This text will tell user to  Cancel"
											/>
										</Button>
									</Box>
								</Grid>
							</Grid>
						</Form>
					)}
				</Formik>
			</Grid>
			{roleCreationLoading && (
				<Box
					position="fixed"
					left="50%"
					top="50%"
					style={{ transform: "translate(-50%, -50%)" }}
				>
					<CircularProgress />
				</Box>
			)}
		</Grid>
	);
}

export default AddRoleView;
