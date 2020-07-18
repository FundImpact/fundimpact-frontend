import React from "react";
import LandingPage from "../pages/Landing/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/Login";

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="" element={<LandingPage />}>
					<Route path="login" element={<Login />} />
					<Route path="signup" />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default AppRoutes;
