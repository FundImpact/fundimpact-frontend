import { ApolloProvider } from "@apollo/client";
import React, { useState } from "react";
import { RouteProps, useLocation } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainDashboard from "../components/Dasboard/MainDashboard";
import { DashboardProvider } from "../contexts/dashboardContext";
import { NotificationProvider } from "../contexts/notificationContext";
import { useAuth } from "../contexts/userContext";
import { SetTokenAndRedirect } from "../hooks/userDetailsWithToken";
import LandingPage from "../pages/Landing/Landing";
import { client } from "./grapql";

const SignUp = React.lazy(() => import("../pages/Signup/SignUp"));
const Login = React.lazy(() => import("../pages/Login/Login"));
const DashboardContainer = React.lazy(() => import("../pages/Dashboard/DashboardContainer"));
const AccountSettingsContainer = React.lazy(
	() => import("../pages/AccountSettings/AccountSettings")
);
const SettingsContainer = React.lazy(() => import("../pages/settings/settings"));
const MainOrganizationDashboard = React.lazy(
	() => import("../components/OrganizationDashboard/MainDashboard")
);

function PrivateRoute({ children, ...rest }: RouteProps): React.ReactElement | null {
	const { jwt } = useAuth();

	let params = new URLSearchParams(window.location.search);
	const tokenInUrl: string | null = params.get("token");

	if (tokenInUrl) {
		SetTokenAndRedirect(tokenInUrl, window.location.pathname);
	}
	if (jwt) {
		return <Route children={children} {...rest} />;
	} else return <Navigate to="/login" state={{ redirectedFrom: rest.path }} />;
}

function AppRoutes() {
	return (
		<BrowserRouter>
			<ApolloProvider client={client}>
				<NotificationProvider>
					<DashboardProvider>
						<Routes>
							<PrivateRoute
								path="dashboard"
								element={
									<DashboardContainer left={null} main={<MainDashboard />} />
								}
							/>
							<PrivateRoute
								path="organization/dashboard"
								element={
									<DashboardContainer
										left={null}
										main={<MainOrganizationDashboard />}
									/>
								}
							/>
							<PrivateRoute path="settings/*" element={<SettingsContainer />} />
							<PrivateRoute path="account/*" element={<AccountSettingsContainer />} />
							<Route path="" element={<LandingPage />}>
								<Route path="login" element={<Login />} />
								<Route path="signup/:id" element={<SignUp />} />
								<Route path="signup" element={<SignUp />} />
							</Route>
						</Routes>
					</DashboardProvider>
				</NotificationProvider>
			</ApolloProvider>
		</BrowserRouter>
	);
}

export default AppRoutes;
