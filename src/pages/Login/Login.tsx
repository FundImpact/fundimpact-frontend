import { Box, Button } from "@material-ui/core";
import { FormikHelpers } from "formik";
import React, { useEffect, useState } from "react";

import AlertMsg from "../../components/AlertMessage/AlertMessage";
import GlobalLoader from "../../components/commons/GlobalLoader";
import LoginForm from "../../components/Forms/Login/LoginForm";
import { useAuth, UserDispatchContext } from "../../contexts/userContext";
import { usePostFetch } from "../../hooks/fetch/usePostFetch";
import { ILoginForm } from "../../models";
import { setUser } from "../../reducers/userReducer";
import { FORGOT_PASSWORD_API, LOGIN_API } from "../../utils/endpoints.util";
import { FormattedMessage } from "react-intl";

function Login(props: { intialFormValue?: ILoginForm }) {
	const initialValues: ILoginForm = props.intialFormValue
		? props.intialFormValue
		: {
				email: "",
				password: "",
		  };

	const userDispatch = React.useContext(UserDispatchContext);
	const [error, setError] = useState<string>();
	const [clickedForgetPass, setClickedForgetPass] = useState(false);
	const [initiateRequest, setInitiateRequest] = useState(false);

	let { data, loading, error: apiError, setPayload } = usePostFetch<any>({
		url: !clickedForgetPass ? LOGIN_API : FORGOT_PASSWORD_API,
		body: null,
		initiateRequest,
	});
	const { logoutMsg } = useAuth();

	function validate(values: ILoginForm) {
		let errors: Partial<ILoginForm> = {};
		if (!values.email) {
			errors.email = "Email is required";
		}
		if (!values.password && !clickedForgetPass) {
			errors.password = "Password is required";
		}

		return errors;
	}

	useEffect(() => {
		if (apiError) {
			if (apiError) setError(apiError);
			else setError("Internal server error");
		}
		if (logoutMsg) setError(logoutMsg);
	}, [apiError, logoutMsg]);

	useEffect(() => {
		if (data)
			if (userDispatch) {
				userDispatch(setUser(data));
			}
	}, [userDispatch, data]);

	function onSubmit(values: ILoginForm, formikHelpers: FormikHelpers<ILoginForm>) {
		setInitiateRequest(true);
		setPayload(values);
	}

	const clearErrors = () => {
		if (error) setError("");
	};

	return (
		<Box mx="auto" height={"100%"} width={{ xs: "100%", md: "75%", lg: "50%" }}>
			<LoginForm {...{ onSubmit, initialValues, clearErrors, validate, clickedForgetPass }} />
			<Box display="flex" m={1}>
				<Box flexGrow={1} />
				<Button
					onClick={() => {
						setInitiateRequest(false);
						setClickedForgetPass(!clickedForgetPass);
					}}
				>
					{!clickedForgetPass ? (
						<FormattedMessage
							defaultMessage="Forget Password ?"
							id="forgot_password"
							description="forgot password"
						/>
					) : (
						<FormattedMessage
							defaultMessage="Login"
							id="login_button"
							description="login button"
						/>
					)}
				</Button>
			</Box>
			{loading ? <GlobalLoader /> : null}
			{error ? <AlertMsg severity="error" msg={error} /> : null}
		</Box>
	);
}

export default Login;
