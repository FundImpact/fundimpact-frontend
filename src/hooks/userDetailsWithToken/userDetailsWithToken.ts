import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { UserDispatchContext } from "../../contexts/userContext";
import { setUser } from "../../reducers/userReducer";

export function SetTokenAndRedirect(token: string, path: string) {
	const navigate = useNavigate();
	const userDispatch = React.useContext(UserDispatchContext);
	useEffect(() => {
		if (userDispatch) {
			userDispatch(setUser({ jwt: token }));
		}
		navigate(path.concat("/verify"));
	}, []);
}
