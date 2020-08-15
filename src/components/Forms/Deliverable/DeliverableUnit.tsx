import {
	Box,
	Button,
	createStyles,
	Dialog,
	DialogContent,
	makeStyles,
	TextField,
	Theme,
	Grid,
	Typography,
	Card,
	FormControl,
	MenuItem,
	Select,
	InputLabel,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";
import { IDeliverableUnitFormProps } from "../../../models/deliverable/deliverableUnitForm";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../graphql/queries/Deliverable/category";
import { useQuery } from "@apollo/client";
import { IDeliverableUnit } from "../../../models/deliverable/deliverableUnit";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			"& .MuiTextField-root,": {
				margin: theme.spacing(1),
				marginBottom: theme.spacing(0),
			},
			"& .MuiButtonBase-root": {
				marginRight: theme.spacing(1),
			},
		},
		button: {
			color: theme.palette.common.white,
			margin: theme.spacing(1),
		},
		leftBox: {
			width: "100%",
			backgroundColor: "#e3f2fd",
			height: "40%",
			marginTop: theme.spacing(1),
		},
		formControl: {
			margin: theme.spacing(1),
		},
	})
);

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & { children?: React.ReactElement<any, any> },
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function DeliverableUnitForm({
	clearErrors,
	initialValues,
	validate,
	formState,
	onCreate,
	onUpdate,
	children,
	formIsOpen,
	handleFormOpen,
}: IDeliverableUnitFormProps & React.PropsWithChildren<IDeliverableUnitFormProps>) {
	const classes = useStyles();
	const { loading, data } = useQuery(GET_DELIVERABLE_ORG_CATEGORY);
	useEffect(() => {}, [data]); // re-render when got categorylist
	const validateInitialValue = (initialValue: IDeliverableUnit) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};
	return (
		<Dialog
			fullWidth
			open={formIsOpen}
			aria-labelledby="form-dialog-title"
			maxWidth="md"
			TransitionComponent={Transition}
		>
			<DialogContent>
				<Box
					mx="auto"
					height={"100%"}
					width={{ xs: "100%", md: "100%", lg: "100%" }}
					onChange={clearErrors}
				>
					<Grid container justify={"center"}>
						<Grid item xs={4}>
							<Typography variant="h6" gutterBottom>
								New Deliverable Unit
							</Typography>
							<Typography variant="subtitle2" gutterBottom color="textSecondary">
								Physical addresses of your organisation like headquarter branch etc
							</Typography>
							<Card elevation={0} className={classes.leftBox}>
								<Box mt={2} ml={3}>
									<Typography variant="subtitle1" gutterBottom color="primary">
										WORKSPACE 1
									</Typography>
								</Box>
								<Box m={1} ml={3}>
									<Typography variant="body2" gutterBottom color="textPrimary">
										PROJECT 1
									</Typography>
								</Box>
							</Card>
						</Grid>
						<Grid item xs={8}>
							<Formik
								validateOnBlur
								validateOnChange
								initialValues={initialValues}
								isInitialValid={(props: any) =>
									validateInitialValue(props.initialValues)
								}
								enableReinitialize={true}
								validate={validate}
								onSubmit={(values) =>
									formState === DELIVERABLE_ACTIONS.CREATE
										? onCreate(values)
										: onUpdate(values)
								}
							>
								{(formik) => {
									return (
										<Form
											id="deliverable_unit_form"
											className={classes.root}
											autoComplete="off"
										>
											<Grid container spacing={1}>
												<Grid item xs={6}>
													<TextField
														data-testid="name"
														value={formik.values.name}
														error={!!formik.errors.name}
														helperText={
															formik.touched.name &&
															formik.errors.name
														}
														onChange={formik.handleChange}
														label="Name"
														required
														name="name"
														variant="outlined"
														fullWidth
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														data-testid="code"
														value={formik.values.code}
														error={!!formik.errors.code}
														helperText={
															formik.touched.code &&
															formik.errors.code
														}
														onChange={formik.handleChange}
														label="Code"
														required
														name="code"
														variant="outlined"
														fullWidth
													/>
												</Grid>
												<Grid item xs={6}>
													<FormControl
														variant="outlined"
														fullWidth
														className={classes.formControl}
													>
														<InputLabel id="demo-simple-select-outlined-label">
															Deliverable Category
														</InputLabel>
														<Select
															labelId="demo-simple-select-outlined-label"
															id="demo-simple-select-outlined"
															error={
																!!formik.errors.deliverableCategory
															}
															value={
																formik.values.deliverableCategory
															}
															required
															onChange={formik.handleChange}
															label="Deliverable Category"
															name="deliverableCategory"
															data-testid="deliverableCategory"
															inputProps={{
																"data-testid":
																	"deliverableCategory",
															}}
														>
															{data &&
																data.deliverableCategory &&
																data.deliverableCategory.map(
																	(
																		elem: {
																			id: number;
																			name: string;
																		},
																		index: number
																	) => (
																		<MenuItem
																			key={index}
																			value={elem.id}
																		>
																			{elem.name}
																		</MenuItem>
																	)
																)}
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={6}>
													<TextField
														data-testid="unit_type"
														value={formik.values.unit_type}
														error={!!formik.errors.unit_type}
														helperText={
															formik.touched.unit_type &&
															formik.errors.unit_type
														}
														onChange={formik.handleChange}
														label="Unit type"
														required
														name="unit_type"
														variant="outlined"
														fullWidth
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														data-testid="suffix_label"
														value={formik.values.suffix_label}
														error={!!formik.errors.suffix_label}
														helperText={
															formik.touched.suffix_label &&
															formik.errors.suffix_label
														}
														onChange={formik.handleChange}
														label="Suffix Label"
														required
														name="suffix_label"
														variant="outlined"
														fullWidth
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														data-testid="prefix_label"
														value={formik.values.prefix_label}
														error={!!formik.errors.prefix_label}
														helperText={
															formik.touched.prefix_label &&
															formik.errors.prefix_label
														}
														onChange={formik.handleChange}
														label="Prefix Label"
														required
														name="prefix_label"
														variant="outlined"
														fullWidth
													/>
												</Grid>
												<Grid item xs={12}>
													<TextField
														data-testid="description"
														value={formik.values.description}
														error={!!formik.errors.description}
														onChange={formik.handleChange}
														label="Description"
														multiline
														rows={3}
														name="description"
														type="text"
														variant="outlined"
														fullWidth
													/>
												</Grid>
												<Box display="flex" m={1}>
													<Button
														color="secondary"
														className={classes.button}
														onClick={handleFormOpen}
														variant="contained"
													>
														Cancel
													</Button>
													<Button
														className={classes.button}
														data-testid="submit"
														form="deliverable_unit_form"
														disabled={!formik.isValid}
														type="submit"
														color="primary"
														variant="contained"
													>
														{formState === DELIVERABLE_ACTIONS.CREATE
															? "Create"
															: "Update"}
													</Button>
												</Box>
											</Grid>
										</Form>
									);
								}}
							</Formik>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
			{children ? children : null}
		</Dialog>
	);
}

export default DeliverableUnitForm;
