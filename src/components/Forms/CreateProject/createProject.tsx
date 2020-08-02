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
	return (
		<div onChange={clearErrors}>
			<Formik
				initialValues={initialValues}
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
										error={!!formik.errors.name}
										helperText={formik.touched.name && formik.errors.name}
										onChange={formik.handleChange}
										label="Project Name"
										required
										fullWidth
										name="name"
										variant="outlined"
									/>
								</Grid>
								<Grid item xs={6} md={6}>
									<TextField
										error={!!formik.errors.short_name}
										helperText={
											formik.touched.short_name && formik.errors.short_name
										}
										onChange={formik.handleChange}
										label="Short Name"
										required
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
												value={formik.values.workspace}
												onChange={formik.handleChange}
												label="Choose workspace"
												name="workspace"
											>
												{workspace &&
													workspace.map((elem: any, index: number) => (
														<MenuItem key={index} value={elem.id}>
															{elem.name}
														</MenuItem>
													))}
											</Select>
										)}
									</FormControl>
								</Grid>
								<Grid xs={12}>
									<TextField
										data-testid="description"
										value={formik.values.description}
										error={!!formik.errors.description}
										onChange={formik.handleChange}
										label="Description.. ( Optional )"
										multiline
										rows={3}
										name="description"
										type="text"
										variant="outlined"
										fullWidth
									/>
								</Grid>
								<Grid item container>
									<Grid xs={8}></Grid>
									<Grid xs={4}>
										<Box mt={3}>
											<Button
												fullWidth
												disabled={!formik.isValid}
												type="submit"
												variant="contained"
												color="primary"
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
