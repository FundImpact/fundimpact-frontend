import React from "react";
import { useEffect } from "react";
import { Navigate } from "react-router";
import { GlobalLoader } from "../../components/commons";
import { useAuth, UserDispatchContext } from "../../contexts/userContext";
import { setUser } from "../../reducers/userReducer";
import { GOOGLE_SIGN_IN } from "../../utils/endpoints.util";
import { useGetFetchWithCondition } from "../fetch/useFetch";

export function UserResponseFromGoogleApiAndRedirect() {
	const userDispatch = React.useContext(UserDispatchContext);
	const [token, setToken] = React.useState("");

	let { data, loading, error } = useGetFetchWithCondition<any>({
		url: `${GOOGLE_SIGN_IN}?id_token=${token}`,
		condition: token ? true : false,
	});

	useEffect(() => {
		let id_token = window.location.search.split("?id_token=")[1];
		if (id_token) {
			setToken(id_token);
		}
	}, []);

	useEffect(() => {
		if (data?.jwt) {
			if (userDispatch) {
				userDispatch(setUser(data));
			}
		}
		if (error) {
			if (userDispatch) {
				userDispatch({
					type: "LOGOUT_USER",
					payload: { logoutMsg: "Internal Server Error." },
				});
			}
		}
	}, [data, error]);

	const auth = useAuth();
	const user: any = auth.user;

	return (
		<>
			{loading && <GlobalLoader />}
			{user && <Navigate to="/organization/dashboard" />}
		</>
	);
}
