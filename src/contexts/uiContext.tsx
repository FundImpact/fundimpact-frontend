import React from "react";
import { createMuiTheme, ThemeOptions, CssBaseline, ThemeProvider } from "@material-ui/core";

function getMuiTheme(): ThemeOptions {
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
	const theme = getMuiTheme();
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}

export { UIProvider };
