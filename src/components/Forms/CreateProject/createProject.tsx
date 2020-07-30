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
	Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Form, Formik, FormikHelpers } from "formik";
import React from "react";
import AlertMsg from "../../AlertMessage/AlertMessage";
import { UserDispatchContext } from "../../../contexts/userContext";
import { useGetFetch } from "../../../hooks/fetch/useFetch";
import { usePostFetch } from "../../../hooks/fetch/usePostFetch";
import useRouteResolver from "../../../hooks/routes/useRouteResolver";
import { IBasicInformation } from "../../../models";
import { IOrganisationType } from "../../../models/organisation/types";
import { IUserSignupResponse } from "../../../models/signup/userSignUpResponse";
import { setUser } from "../../../reducers/userReducer";
import { ORGANISATION_TYPES_API, SIGNUP_API } from "../../../utils/endpoints.util";
import { getDefaultBasicInformation } from "../../../utils/signup.util";
import GlobalLoader from "../../commons/GlobalLoader";

// import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			display: "flex",
			"& .MuiTextField-root": {
				margin: theme.spacing(1),
				spacing: 1,
			},
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 120,
		},
	})
);

const CreateProject = () => {
	const initialValues: IBasicInformation = getDefaultBasicInformation();
	const classes = useStyles();

	let { error, loading, data: singupSuccessfulResponse, setPayload } = usePostFetch<
		IUserSignupResponse
	>({ body: null, url: SIGNUP_API });
	let { error: OrganisationError, data: organisationTypes } = useGetFetch<IOrganisationType[]>({
		url: ORGANISATION_TYPES_API,
	});
	const userDispatch = React.useContext(UserDispatchContext);

	useRouteResolver();

	React.useEffect(() => {
		if (singupSuccessfulResponse)
			if (userDispatch) {
				userDispatch(setUser(singupSuccessfulResponse));
			}
	}, [singupSuccessfulResponse, userDispatch]);

	const OnSubmit = (
		values: IBasicInformation,
		formikHelpers: FormikHelpers<IBasicInformation>
	) => {
		setPayload(values);

		// navigate(`/signup/${SignUpSteps.SET_ORG}`);
	};
	const clearErrors = () => {
		if (error) error = "";
	};
	return (
		<div onChange={clearErrors}>
			<Formik initialValues={initialValues} onSubmit={OnSubmit}>
				{(formik) => {
					return (
						<Form className={classes.form}>
							<Grid container spacing={4} justify={"center"}>
								<Grid item xs={8} md={8}>
									<Box>
										<Typography component="h4" variant="h4">
											<Box m={1}>Create Project</Box>
										</Typography>
									</Box>
								</Grid>
								<Grid item xs={8} md={8}>
									<TextField
										error={!!formik.errors.organisation?.name}
										helperText={
											formik.touched.organisation?.name &&
											formik.errors.organisation?.name
										}
										onChange={formik.handleChange}
										label="Project Name"
										required
										fullWidth
										name="project.name"
										variant="outlined"
									/>
								</Grid>
								<Grid item xs={8} md={8}>
									<TextField
										error={!!formik.errors.organisation?.name}
										helperText={
											formik.touched.organisation?.name &&
											formik.errors.organisation?.name
										}
										onChange={formik.handleChange}
										label="Short Name"
										required
										fullWidth
										name="project.shortName"
										variant="outlined"
									/>
								</Grid>
								<Grid item xs={8} md={8}>
									<FormControl
										variant="outlined"
										className={classes.formControl}
										fullWidth
									>
										<InputLabel htmlFor="outlined-age-native-simple">
											Choose Workspace
										</InputLabel>
										<Select
											native
											required
											label="Choose Workspace"
											name="workspaceId"
											value={"Workspace 1"}
											onChange={formik.handleChange}
											inputProps={{
												name: "workspace",
											}}
										>
											<option value={1}>Workspace 1</option>
											<option value={2}>Workspace 2</option>
											<option value={3}>Workspace 3</option>
										</Select>
									</FormControl>
								</Grid>
								<Grid item xs={8}>
									<Button
										fullWidth
										disabled={!formik.isValid}
										type="submit"
										variant="contained"
										color="primary"
									>
										Submit
									</Button>

									{loading ? <GlobalLoader /> : null}
									{singupSuccessfulResponse ? (
										<p className="text-center"> Singgup Successfull </p>
									) : null}

									{error ? <AlertMsg severity="error" msg={error} /> : null}
								</Grid>
							</Grid>
						</Form>
					);
				}}
			</Formik>
		</div>
	);
};

export default CreateProject;
