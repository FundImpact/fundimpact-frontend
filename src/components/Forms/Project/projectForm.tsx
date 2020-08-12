import {
	Button,
	createStyles,
	Grid,
	TextField,
	Theme,
	FormControl,
	InputLabel,
	Select,
	Box,
	MenuItem,
	Dialog,
	DialogContent,
	Typography,
	Card,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import { IProjectFormProps } from "../../../models/project/ProjectForm";
import { PROJECT_ACTIONS } from "../../Project/constants";
import { IProject, ProjectProps } from "../../../models/project/project";
import React, { useState } from "react";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			flexDirection: "column",
			"& .MuiTextField-root,": {
				margin: theme.spacing(1),
			},
		},
		button: {
			color: theme.palette.common.white,
			margin: theme.spacing(1),
			marginLeft: theme.spacing(0),
		},
		leftBox: {
			width: "100%",
			backgroundColor: "#e3f2fd",
			height: "40%",
			marginTop: theme.spacing(1),
		},
		form: {
			margin: theme.spacing(1),
		},
		formControl: {
			margin: theme.spacing(1),
			width: "100%",
		},
	})
);

const Transition = React.forwardRef(function Transition(
	props: TransitionProps & { children?: React.ReactElement<any, any> },
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function ProjectForm({
	clearErrors,
	initialValues,
	validate,
	formState,
	onCreate,
	onUpdate,
	children,
	workspaces,
	formIsOpen,
	handleFormOpen,
}: IProjectFormProps & React.PropsWithChildren<IProjectFormProps>) {
	const classes = useStyles();

	const validateInitialValue = (initialValue: IProject) => {
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
								New Project
							</Typography>
							<Typography variant="subtitle2" gutterBottom color="textSecondary">
								Add a project to start tracking your funds and impact
							</Typography>
							<Card elevation={0} className={classes.leftBox}>
								<Box mt={2} ml={3}>
									<Typography variant="subtitle1" gutterBottom color="primary">
										Organisation 1
									</Typography>
								</Box>
								<Box m={1} ml={3}>
									<Typography variant="body2" gutterBottom color="textPrimary">
										Workspace 1
									</Typography>
								</Box>
							</Card>
						</Grid>
						<Grid item xs={8}>
							<div onChange={clearErrors} className={classes.form}>
								<Formik
									initialValues={initialValues}
									validate={validate}
									isInitialValid={(props: any) =>
										validateInitialValue(props.initialValues)
									}
									onSubmit={(values) =>
										formState === PROJECT_ACTIONS.CREATE
											? onCreate(values)
											: onUpdate(values)
									}
								>
									{(formik) => {
										return (
											<Form
												id="project_form"
												className={classes.root}
												autoComplete="off"
											>
												<Grid container spacing={1} justify={"center"}>
													<TextField
														value={formik.values.name}
														error={!!formik.errors.name}
														helperText={
															formik.touched.name &&
															formik.errors.name
														}
														onChange={formik.handleChange}
														data-testid="createProjectName"
														label="Project Name"
														inputProps={{
															"data-testid": "createProjectNameInput",
														}}
														required
														fullWidth
														name="name"
														variant="outlined"
													/>
													<TextField
														onChange={formik.handleChange}
														data-testid="createProjectShortName"
														inputProps={{
															"data-testid":
																"createProjectShortNameInput",
														}}
														value={formik.values.short_name}
														label="Short Name"
														fullWidth
														name="short_name"
														variant="outlined"
													/>
													<FormControl
														variant="outlined"
														className={classes.formControl}
													>
														<InputLabel id="demo-simple-select-outlined-label">
															Choose Workspace
														</InputLabel>
														{workspaces && (
															<Select
																labelId="demo-simple-select-outlined-label"
																id="demo-simple-select-outlined"
																error={!!formik.errors.workspace}
																value={formik.values.workspace}
																onChange={formik.handleChange}
																label="Choose workspace"
																name="workspace"
																data-testid="createProjectWorkspace"
																inputProps={{
																	"data-testid":
																		"createProjectWorkspaceOption",
																}}
															>
																{workspaces &&
																	workspaces.map(
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
														)}
													</FormControl>
													<TextField
														data-testid="createProjectDescription"
														value={formik.values.description}
														onChange={formik.handleChange}
														inputProps={{
															"data-testid":
																"createProjectDescriptionInput",
														}}
														label="Description.. ( Optional )"
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
														data-testid="createProjectSubmit"
														disabled={!formik.isValid}
														form="project_form"
														type="submit"
														color="primary"
														variant="contained"
													>
														{formState === PROJECT_ACTIONS.CREATE
															? "Create"
															: "Update"}
													</Button>
												</Box>
											</Form>
										);
									}}
								</Formik>
							</div>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
			{children ? children : null}
		</Dialog>
	);
}

export default ProjectForm;
