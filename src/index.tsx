import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { UIProvider } from "./contexts/uiContext";
import { UserProvider } from "./contexts/userContext";

ReactDOM.render(
	<React.StrictMode>
		<UIProvider>
			<UserProvider>
				<App />
			</UserProvider>
		</UIProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
