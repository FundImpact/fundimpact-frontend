import React from "react";
import LandingPage from "../pages/Landing/Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import SignUp from "../components/SignUp";

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
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
