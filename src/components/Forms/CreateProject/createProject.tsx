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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik } from "formik";
import { IProjectFormProps } from "../../../models/project/ProjectForm";
import { PROJECT_ACTIONS } from "../../Project/constants";
import React from "react";
import { IProject } from "../../../models/project/project";

// import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			display: "flex",
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				spacing: 1,
			},
			"& .MuiOutlinedInput-input": {
				padding: theme.spacing(2),
			},
		},
		formControl: {
			margin: theme.spacing(1),
			width: "100%",
		},
	})
);

function CreateProject({
	clearErrors,
	initialValues,
	validate,
	formState,
	onCreate,
	onUpdate,
	children,
	workspace,
}: IProjectFormProps & React.PropsWithChildren<IProjectFormProps>) {
	const classes = useStyles();
	const validateInitialValue = (initialValue: IProject) => {
		const errors = validate(initialValue) as object;
		if (!errors) return true;
		return Object.keys(errors).length ? false : true;
	};
	return (
		<div onChange={clearErrors}>
			<Formik
				initialValues={initialValues}
				validate={validate}
				isInitialValid={(props: any) => validateInitialValue(props.initialValues)}
				onSubmit={(values) =>
					formState === PROJECT_ACTIONS.CREATE ? onCreate(values) : onUpdate(values)
				}
			>
				{(formik) => {
					return (
						<Form className={classes.form}>
							<Grid container spacing={1} justify={"center"}>
								<Grid item xs={6} md={6}>
									<TextField
										value={formik.values.name}
										error={!!formik.errors.name}
										helperText={formik.touched.name && formik.errors.name}
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
								</Grid>
								<Grid item xs={6} md={6}>
									<TextField
										onChange={formik.handleChange}
										data-testid="createProjectShortName"
										inputProps={{
											"data-testid": "createProjectShortNameInput",
										}}
										value={formik.values.short_name}
										label="Short Name"
										fullWidth
										name="short_name"
										variant="outlined"
									/>
								</Grid>
								<Grid item xs={12} md={12}>
									<FormControl variant="outlined" className={classes.formControl}>
										<InputLabel id="demo-simple-select-outlined-label">
											Choose Workspace
										</InputLabel>
										{workspace && (
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
													"data-testid": "createProjectWorkspaceOption",
												}}
											>
												{workspace &&
													workspace.map(
														(
															elem: { id: number; name: string },
															index: number
														) => (
															<MenuItem key={index} value={elem.id}>
																{elem.name}
															</MenuItem>
														)
													)}
											</Select>
										)}
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<TextField
										data-testid="createProjectDescription"
										value={formik.values.description}
										onChange={formik.handleChange}
										inputProps={{
											"data-testid": "createProjectDescriptionInput",
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
								<Grid container>
									<Grid item xs={8}></Grid>
									<Grid item xs={4}>
										<Box mt={3}>
											<Button
												fullWidth
												disabled={!formik.isValid}
												type="submit"
												variant="contained"
												color="primary"
												data-testid="createProjectSubmit"
											>
												Submit
											</Button>
										</Box>
									</Grid>
								</Grid>
							</Grid>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
}

export default CreateProject;
