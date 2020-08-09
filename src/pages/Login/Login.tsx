import { Box } from "@material-ui/core";
import { FormikHelpers } from "formik";
import React from "react";

import AlertMsg from "../../components/AlertMessage/AlertMessage";
import GlobalLoader from "../../components/commons/GlobalLoader";
import LoginForm from "../../components/Forms/Login/LoginForm";
import { UserDispatchContext } from "../../contexts/userContext";
import { usePostFetch } from "../../hooks/fetch/usePostFetch";
import { ILoginForm } from "../../models";
import { setUser } from "../../reducers/userReducer";
import { LOGIN_API } from "../../utils/endpoints.util";

// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		errorMessage: { width: "95%" },
// 	})
// );

function validate(values: ILoginForm) {
	let errors: Partial<ILoginForm> = {};
	if (!values.email) {
		errors.email = "Email is required";
	}
	if (!values.password) {
		errors.password = "Password is required";
	}

	return errors;
}

function Login(props: { intialFormValue?: ILoginForm }) {
	// const classes = useStyles();
	const initialValues: ILoginForm = props.intialFormValue
		? props.intialFormValue
		: {
				email: "vinitkumar12@gmail.com",
				password: "vinit@123",
		  };

	const userDispatch = React.useContext(UserDispatchContext);

	let { data, loading, error: apiError, setPayload } = usePostFetch<any>({
		url: LOGIN_API,
		body: null,
	});

	React.useEffect(() => {
		if (data)
			if (userDispatch) {
				userDispatch(setUser(data));
			}
	}, [userDispatch, data]);

	function onSubmit(values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) {
		setPayload(values);
	}

	const clearErrors = () => {
		console.log("clearErors");
		if (apiError) apiError = undefined;
	};
	return (
		<Box mx="auto" height={"100%"} width={{ xs: "100%", md: "75%", lg: "50%" }}>
			<LoginForm {...{ onSubmit, initialValues, clearErrors, validate }} />
			{loading ? <GlobalLoader /> : null}
			{apiError ? <AlertMsg severity="error" msg={apiError} /> : null}
			{data ? <p> Login Successs </p> : null}
		</Box>
	);
}

export default Login;
