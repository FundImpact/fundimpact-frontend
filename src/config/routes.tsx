import React from "react";
import LandingPage from "../pages/Landing/Landing";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RouteProps } from "react-router";
import { useAuth } from "../contexts/userContext";

const SignUp = React.lazy(() => import("../components/SignUp"));
const Login = React.lazy(() => import("../components/Login"));

function PrivateRoute({ children, ...rest }: RouteProps): React.ReactElement | null {
	const { jwt } = useAuth();
	if (jwt) {
		return <Route children={children} {...rest} />;
	} else return <Navigate to="/login" state={{ redirectedFrom: rest.path }} />;
}

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<PrivateRoute path="dashboard" element={<div>Example Private Route</div>} />
				<Route path="" element={<LandingPage />}>
					<Route path="login" element={<Login />} />
					<Route path="signup/:id" element={<SignUp />} />
					<Route path="signup" element={<SignUp />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default AppRoutes;
