import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { IntlProvider } from "react-intl";

import App from "./App";
import { UIProvider } from "./contexts/uiContext";
import { UserProvider } from "./contexts/userContext";
import * as serviceWorker from "./serviceWorker";
import { DashboardProvider } from "./contexts/dashboardContext";
import { MultilingualProvider } from "./contexts/multilingualContext";
import ReactGA from "react-ga";

function initializeReactGa() {
	ReactGA.initialize("G-0J46Q89H5R");
	ReactGA.pageview(window.location.pathname + window.location.search);
}

(async function () {
	initializeReactGa();

	ReactDOM.render(
		<UserProvider>
			<MultilingualProvider>
				<DashboardProvider>
					<UIProvider>
						<App />
					</UIProvider>
				</DashboardProvider>
			</MultilingualProvider>
		</UserProvider>,
		document.getElementById("root")
	);
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
