import {
	Box,
	Button,
	createStyles,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	TextField,
	Theme,
} from "@material-ui/core";
import { Form, Formik } from "formik";
import React, { useState } from "react";

import { IWorkspaceFormProps } from "../../../models/workspace/workspaceForm";
import { WORKSPACE_ACTIONS } from "../../workspace/constants";

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
		button: {
			color: theme.palette.common.white,
		},
	})
);

function WorkspaceForm({
	clearErrors,
	initialValues,
	validate,
	formState,
	onCreate,
	onUpdate,
	children,
}: IWorkspaceFormProps & React.PropsWithChildren<IWorkspaceFormProps>) {
	const classes = useStyles();
	const [showForm, setShowForm] = useState(true);

	return (
		<Dialog fullWidth open={showForm} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Workspace</DialogTitle>

			<DialogContent>
				<Box
					mx="auto"
					height={"100%"}
					width={{ xs: "100%", md: "100%", lg: "100%" }}
					onChange={clearErrors}
				>
					<Formik
						validateOnBlur
						validateOnChange
						initialValues={initialValues}
						enableReinitialize={true}
						validate={validate}
						onSubmit={(values) =>
							formState === WORKSPACE_ACTIONS.CREATE
								? onCreate(values)
								: onUpdate(values)
						}
					>
						{(formik) => {
							return (
								<Form
									id="workspace_form"
									className={classes.root}
									autoComplete="off"
								>
									<TextField
										data-testid="name"
										value={formik.values.name}
										error={!!formik.errors.name}
										helperText={formik.touched.name && formik.errors.name}
										onChange={formik.handleChange}
										label="Name"
										required
										name="name"
										variant="outlined"
										fullWidth
									/>

									<TextField
										data-testid="short_name"
										value={formik.values.short_name}
										error={!!formik.errors.short_name}
										onChange={formik.handleChange}
										label="Short Name"
										required
										name="short_name"
										type="text"
										variant="outlined"
										fullWidth
									/>
									<TextField
										data-testid="description"
										value={formik.values.description}
										error={!!formik.errors.description}
										onChange={formik.handleChange}
										label="Description"
										multiline
										rows={7}
										name="description"
										type="text"
										variant="outlined"
										fullWidth
									/>
								</Form>
							);
						}}
					</Formik>
				</Box>
			</DialogContent>
			{children ? children : null}
			<DialogActions>
				<Button
					color="secondary"
					className={classes.button}
					onClick={() => setShowForm(false)}
					variant="contained"
				>
					Cancel
				</Button>
				<Button
					data-testid="submit"
					form="workspace_form"
					type="submit"
					color="primary"
					variant="contained"
				>
					{formState === WORKSPACE_ACTIONS.CREATE ? "Create" : "Update"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default WorkspaceForm;
