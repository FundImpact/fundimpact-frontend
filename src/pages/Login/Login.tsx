import { Box } from "@material-ui/core";
import { FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";

import AlertMsg from "../../components/AlertMessage/AlertMessage";
import GlobalLoader from "../../components/commons/GlobalLoader";
import LoginForm from "../../components/Forms/Login/LoginForm";
import { useAuth, UserDispatchContext } from "../../contexts/userContext";
import { usePostFetch } from "../../hooks/fetch/usePostFetch";
import { ILoginForm } from "../../models";
import { setUser } from "../../reducers/userReducer";
import { LOGIN_API } from "../../utils/endpoints.util";

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
	const initialValues: ILoginForm = props.intialFormValue
		? props.intialFormValue
		: {
				email: "",
				password: "",
		  };

	const userDispatch = React.useContext(UserDispatchContext);
	const [error, setError] = useState<string>();
	let { data, loading, error: apiError, setPayload } = usePostFetch<any>({
		url: LOGIN_API,
		body: null,
	});
	const { logoutMsg } = useAuth();

	useEffect(() => {
		if (apiError) {
			if (apiError === "User not found") setError(apiError);
			else setError("Internal server error");
		}
		if (logoutMsg) setError(logoutMsg);

		console.log("apiError", apiError);
	}, [apiError]);

	useEffect(() => {
		if (data)
			if (userDispatch) {
				userDispatch(setUser(data));
			}
	}, [userDispatch, data]);

	function onSubmit(values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) {
		setPayload(values);
	}

	const clearErrors = () => {
		if (error) setError("");
	};

	return (
		<Box mx="auto" height={"100%"} width={{ xs: "100%", md: "75%", lg: "50%" }}>
			<LoginForm {...{ onSubmit, initialValues, clearErrors, validate }} />
			{loading ? <GlobalLoader /> : null}
			{error ? <AlertMsg severity="error" msg={error} /> : null}
		</Box>
	);
}

export default Login;
