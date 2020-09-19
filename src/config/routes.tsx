import { ApolloProvider } from "@apollo/client";
import React from "react";
import { RouteProps } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainDashboard from "../components/Dasboard/MainDashboard";
import MainOrganizationDashboard from "../components/OrganizationDashboard/MainDashboard";
import { DashboardProvider } from "../contexts/dashboardContext";
import { NotificationProvider } from "../contexts/notificationContext";
import { useAuth } from "../contexts/userContext";
import LandingPage from "../pages/Landing/Landing";
import SettingsContainer from "../pages/settings/settings";
import AccountSettingsContainer from "../pages/AccountSettings/AccountSettings";
import { client } from "./grapql";

const SignUp = React.lazy(() => import("../pages/Signup/SignUp"));
const Login = React.lazy(() => import("../pages/Login/Login"));
const DashboardContainer = React.lazy(() => import("../pages/Dashboard/DashboardContainer"));

function PrivateRoute({ children, ...rest }: RouteProps): React.ReactElement | null {
	const { jwt } = useAuth();
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
							<PrivateRoute
								path="settings/*"
								element={<SettingsContainer></SettingsContainer>}
							/>
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
