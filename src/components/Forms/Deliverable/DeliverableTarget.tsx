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
import { IDeliverableTargetFormProps } from "../../../models/deliverable/deliverableTargetForm";
import { IDeliverableTarget } from "../../../models/deliverable/deliverableTarget";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import { GET_DELIVERABLE_ORG_CATEGORY } from "../../../graphql/queries/Deliverable/category";
import { GET_CATEGORY_UNIT } from "../../../graphql/queries/Deliverable/categoryUnit";
import { useQuery, useLazyQuery } from "@apollo/client";
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			"& .MuiTextField-root,": {
				margin: theme.spacing(1),
				marginBottom: theme.spacing(0),
			},
			"& .MuiButtonBase-root": {
				marginTop: theme.spacing(4),
				marginLeft: theme.spacing(1),
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

function DeliverableTargetForm({
	clearErrors,
	initialValues,
	validate,
	formState,
	onCreate,
	onUpdate,
	children,
	formIsOpen,
	handleFormOpen,
}: IDeliverableTargetFormProps & React.PropsWithChildren<IDeliverableTargetFormProps>) {
	const classes = useStyles();
	const { loading, data: deliverableCategories } = useQuery(GET_DELIVERABLE_ORG_CATEGORY);

	const [getUnitsByCategory, { data: unitsBycategory }] = useLazyQuery(GET_CATEGORY_UNIT);

	const [currCategoryId, setCurrentCategoryId] = React.useState<any>(null);

	const validateInitialValue = (initialValue: IDeliverableTarget) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};

	useEffect(() => {
		if (currCategoryId) {
			// get units by catrgory
			getUnitsByCategory({
				variables: { filter: { deliverable_category_org: currCategoryId } },
			});
		}
	}, [currCategoryId]);

	useEffect(() => {}, [deliverableCategories]);
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
								New Deliverable Target
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
								enableReinitialize={true}
								validate={validate}
								isInitialValid={(props: any) =>
									validateInitialValue(props.initialValues)
								}
								onSubmit={(values) =>
									formState === DELIVERABLE_ACTIONS.CREATE
										? onCreate(values)
										: onUpdate(values)
								}
							>
								{(formik) => {
									return (
										<Form
											id="deliverable_target_form"
											className={classes.root}
											autoComplete="off"
										>
											<Grid container spacing={1}>
												<Grid item xs={6}>
													<TextField
														deliverableCategories-testid="name"
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
														deliverableCategories-testid="target_value"
														value={formik.values.target_value}
														error={!!formik.errors.target_value}
														helperText={
															formik.touched.target_value &&
															formik.errors.target_value
														}
														onChange={formik.handleChange}
														label="Target value"
														required
														name="target_value"
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
															onChange={(event) => {
																setCurrentCategoryId(
																	event.target.value
																);
																formik.handleChange(event);
															}}
															label="Deliverable Category"
															name="deliverableCategory"
															required
															deliverableCategories-testid="deliverableCategory"
															inputProps={{
																"deliverableCategories-testid":
																	"deliverableCategory",
															}}
														>
															{!deliverableCategories && (
																<MenuItem value="">
																	<em>None</em>
																</MenuItem>
															)}
															{deliverableCategories &&
																deliverableCategories.deliverableCategory &&
																deliverableCategories.deliverableCategory.map(
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
													<FormControl
														variant="outlined"
														fullWidth
														className={classes.formControl}
													>
														<InputLabel id="demo-simple-select-outlined-label">
															Deliverable Unit
														</InputLabel>
														<Select
															labelId="demo-simple-select-outlined-label"
															id="demo-simple-select-outlined"
															error={!!formik.errors.deliverableUnit}
															value={formik.values.deliverableUnit}
															required
															onChange={formik.handleChange}
															label="Deliverable Unit"
															name="deliverableUnit"
															data-testid="DeliverableUnit"
															inputProps={{
																"data-testid": "DeliverableUnit",
															}}
														>
															{!unitsBycategory && (
																<MenuItem value="">
																	<em>None</em>
																</MenuItem>
															)}
															{unitsBycategory &&
																unitsBycategory.deliverableCategoryUnitList &&
																unitsBycategory.deliverableCategoryUnitList.map(
																	(
																		elem: {
																			deliverable_units_org: {
																				id: number;
																				name: string;
																			};
																		},
																		index: number
																	) => (
																		<MenuItem
																			key={index}
																			value={
																				elem
																					.deliverable_units_org
																					.id
																			}
																		>
																			{
																				elem
																					.deliverable_units_org
																					.name
																			}
																		</MenuItem>
																	)
																)}
														</Select>
													</FormControl>
												</Grid>
												<Grid item xs={12}>
													<TextField
														deliverableCategories-testid="description"
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
														deliverableCategories-testid="submit"
														form="deliverable_target_form"
														type="submit"
														color="primary"
														disabled={!formik.isValid}
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

export default DeliverableTargetForm;
