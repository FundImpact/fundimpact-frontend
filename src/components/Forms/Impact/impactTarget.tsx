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
import { IImpactTarget } from "../../../models/impact/impactTarget";
import { IImpactTargetFormProps } from "../../../models/impact/impactTargetForm";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import { GET_IMPACT_CATEGORY_UNIT } from "../../../graphql/queries/Impact/categoryUnit";
import { GET_IMPACT_CATEGORY } from "../../../graphql/queries/Impact/category";
import { useQuery, useLazyQuery } from "@apollo/client";
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

function ImpactTargetForm({
	clearErrors,
	initialValues,
	validate,
	formState,
	onCreate,
	onUpdate,
	children,
	formIsOpen,
	handleFormOpen,
}: IImpactTargetFormProps & React.PropsWithChildren<IImpactTargetFormProps>) {
	const classes = useStyles();
	const { data: categories } = useQuery(GET_IMPACT_CATEGORY);

	const [getUnitsByCategory, { data: unitsBycategory }] = useLazyQuery(GET_IMPACT_CATEGORY_UNIT);

	const [currCategoryId, setCurrentCategoryId] = React.useState<any>(null);

	useEffect(() => {}, [categories]);

	useEffect(() => {
		if (currCategoryId) {
			// get units by catrgory
			getUnitsByCategory({ variables: { filter: { impact_category_org: currCategoryId } } });
		}
	}, [currCategoryId]);

	const validateInitialValue = (initialValue: IImpactTarget) => {
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
								New Impact Target
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
								isInitialValid={(props: any) =>
									validateInitialValue(props.initialValues)
								}
								initialValues={initialValues}
								enableReinitialize={true}
								validate={validate}
								onSubmit={(values) =>
									formState === IMPACT_ACTIONS.CREATE
										? onCreate(values)
										: onUpdate(values)
								}
							>
								{(formik) => {
									return (
										<Form
											id="impact_target_form"
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
														data-testid="target_value"
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
															Impact Category
														</InputLabel>
														<Select
															labelId="demo-simple-select-outlined-label"
															id="demo-simple-select-outlined"
															error={!!formik.errors.impactCategory}
															value={formik.values.impactCategory}
															onChange={(event) => {
																setCurrentCategoryId(
																	event.target.value
																);
																formik.handleChange(event);
															}}
															label="Impact Category"
															name="impactCategory"
															data-testid="impactCategory"
															inputProps={{
																"data-testid": "impactCategory",
															}}
														>
															{!categories && (
																<MenuItem value="">
																	<em>None</em>
																</MenuItem>
															)}
															{categories &&
																categories.impactCategoryOrgList &&
																categories.impactCategoryOrgList.map(
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
															Impact Unit
														</InputLabel>
														<Select
															labelId="demo-simple-select-outlined-label"
															id="demo-simple-select-outlined"
															error={!!formik.errors.impactUnit}
															value={formik.values.impactUnit}
															onChange={formik.handleChange}
															label="Impact Unit"
															name="impactUnit"
															data-testid="impactUnit"
															inputProps={{
																"data-testid": "impactUnit",
															}}
														>
															{!unitsBycategory && (
																<MenuItem value="">
																	<em>None</em>
																</MenuItem>
															)}
															{unitsBycategory &&
																unitsBycategory.impactCategoryUnitList &&
																unitsBycategory.impactCategoryUnitList.map(
																	(
																		elem: {
																			impact_units_org: {
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
																					.impact_units_org
																					.id
																			}
																		>
																			{
																				elem
																					.impact_units_org
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
														form="impact_target_form"
														disabled={!formik.isValid}
														type="submit"
														color="primary"
														variant="contained"
													>
														{formState === IMPACT_ACTIONS.CREATE
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

export default ImpactTargetForm;
