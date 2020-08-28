import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { RouteProps } from 'react-router';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import DashboardTableContainer from '../components/Dasboard/Table/DashboardTableContainer';
import { DashboardProvider } from '../contexts/dashboardContext';
import { NotificationProvider } from '../contexts/notificationContext';
import { useAuth } from '../contexts/userContext';
import LandingPage from '../pages/Landing/Landing';
import SettingsContainer from '../pages/settings/settings';
import { client } from './grapql';

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
			<Routes>
				<PrivateRoute
					path="dashboard"
					element={
						<ApolloProvider client={client}>
							<NotificationProvider>
								<DashboardProvider>
									<DashboardContainer
										left={null}
										main={<DashboardTableContainer />}
									/>
								</DashboardProvider>
							</NotificationProvider>
						</ApolloProvider>
					}
				/>
				<PrivateRoute
					path="settings/*"
					element={
						<ApolloProvider client={client}>
							<NotificationProvider>
								<DashboardProvider>
									<SettingsContainer></SettingsContainer>
								</DashboardProvider>
							</NotificationProvider>
						</ApolloProvider>
					}
				/>

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
