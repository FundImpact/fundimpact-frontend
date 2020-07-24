import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/userContext";

export default function useRouteResolver() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { jwt } = useAuth();
	React.useEffect(() => {
		console.log("here", pathname, jwt);
		if (jwt) {
			navigate("/dashboard");
		}
	}, [jwt, pathname]);
}
