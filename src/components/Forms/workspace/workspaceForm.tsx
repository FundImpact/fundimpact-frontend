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
import React, { useEffect, useState } from "react";

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
			marginLeft: theme.spacing(1),
		},
		cancelButton: {
			"&:hover": {
				color: "#d32f2f !important",
			},
			marginLeft: theme.spacing(1),
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
	Close,
}: IWorkspaceFormProps & React.PropsWithChildren<IWorkspaceFormProps>) {
	const classes = useStyles();
	const [showForm, setShowForm] = useState(true);
	useEffect(() => {
		if (!showForm) {
			Close();
		}
	}, [showForm, Close]);

	return (
		<>
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
			<Box ml={4}>
				<Button
					className={classes.button}
					data-testid="submit"
					form="workspace_form"
					type="submit"
					color="secondary"
					variant="contained"
				>
					{formState === WORKSPACE_ACTIONS.CREATE ? "Create" : "Update"}
				</Button>
				<Button className={classes.cancelButton} onClick={() => setShowForm(false)}>
					Cancel
				</Button>
			</Box>
		</>
	);
}

export default WorkspaceForm;
