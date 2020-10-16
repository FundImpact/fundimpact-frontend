import React from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/userContext";

export default function useRouteResolver() {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const { jwt } = useAuth();
	React.useEffect(() => {
		if (jwt) {
			navigate("/organization/dashboard");
		}
	}, [jwt, pathname, navigate]);
}
