import React from "react";
import { RouteProps } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardTableContainer from "../components/DashboardTableContainer";
import { useAuth } from "../contexts/userContext";
import LandingPage from "../pages/Landing/Landing";

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
				<Route path="dashboardTableContainer" element={<DashboardTableContainer />} />

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
