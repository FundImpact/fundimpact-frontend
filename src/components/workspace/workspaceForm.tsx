import classes from "*.module.css";
import { Box, Button, createStyles, makeStyles, TextField, Theme } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";

import { IWorkspace } from "../../models/workspace/workspace";

interface Porps {
	initialValues: IWorkspace;
	clearErrors: any;
	onCreate: any;
	onUpdate: any;
	validate: any;
	formState: "create" | "update";
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			flexDirection: "column",
			"& .MuiTextField-root,": {
				margin: theme.spacing(1),
			},
			"& .MuiButtonBase-root": {
				marginTop: theme.spacing(4),
				marginLeft: theme.spacing(1),
				marginRight: theme.spacing(1),
			},
		},
	})
);

function WorkspaceForm({ clearErrors, initialValues, validate, formState }: Porps) {
	const classes = useStyles();

	return (
		<Box
			mx="auto"
			height={"100%"}
			width={{ xs: "100%", md: "75%", lg: "50%" }}
			onChange={clearErrors}
		>
			<Formik
				validateOnBlur
				initialValues={initialValues}
				enableReinitialize={true}
				validate={validate}
				onSubmit={() => console.log(`value submit`)}
			>
				{(formik) => {
					return (
						<Form className={classes.root} autoComplete="off">
							<TextField
								value={formik.values.name}
								error={!!formik.errors.name}
								helperText={formik.touched.name && formik.errors.name}
								onChange={formik.handleChange}
								label="Name"
								required
								name="name"
								variant="outlined"
							/>

							<TextField
								value={formik.values.short_name}
								error={!!formik.errors.short_name}
								onChange={formik.handleChange}
								label="Short Name"
								required
								name="short_name"
								type="text"
								variant="outlined"
							/>
							<Button
								disabled={!formik.isValid}
								type="submit"
								variant="contained"
								color="primary"
							>
								{formState === "create" ? "Create" : "Update"}
							</Button>
						</Form>
					);
				}}
			</Formik>
		</Box>
	);
}

export default WorkspaceForm;
