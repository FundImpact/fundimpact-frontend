import React from "react";
import LandingPage from "../pages/Landing/Landing";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { RouteProps } from "react-router";
import { useAuth } from "../contexts/userContext";

function PrivateRoute({ children, ...rest }: RouteProps): React.ReactElement | null {
	const { token } = useAuth();
	if (token) {
		return <Route children={children} {...rest} />;
	} else return <Navigate to="/login" state={{ redirectedFrom: rest.path }} />;
}

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<PrivateRoute path="dashboard" element={<div>hey there</div>} />
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
