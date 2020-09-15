import React from "react";
import { createMuiTheme, ThemeOptions, CssBaseline, ThemeProvider, Theme } from "@material-ui/core";
import { useAuth } from "./userContext";

function getMuiTheme(theme: ThemeOptions | undefined | null): ThemeOptions {
	if (theme) {
		return createMuiTheme(theme);
	}
	return createMuiTheme({
		palette: {
			primary: {
				main: "#5567FF",
			},
			secondary: {
				main: "#14BB4C",
			},
		},
	});
}

function UIProvider({ children }: any) {
	const { user } = useAuth();
	const theme = getMuiTheme(user?.theme);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}

export { UIProvider };
