import React from "react";
import { RouteProps } from "react-router";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardTableContainer from "../components/Dasboard/Table/DashboardTableContainer";
import { useAuth } from "../contexts/userContext";
import { ApolloProvider } from "@apollo/client";
import { client } from "./grapql";
import LandingPage from "../pages/Landing/Landing";

const SignUp = React.lazy(() => import("../components/SignUp/SignUp"));
const Login = React.lazy(() => import("../components/Login/Login"));
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
							<DashboardContainer left={null} main={<DashboardTableContainer />} />
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
