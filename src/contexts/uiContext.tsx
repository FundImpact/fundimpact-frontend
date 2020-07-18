import React from "react";
import { createMuiTheme, ThemeOptions, CssBaseline, ThemeProvider } from "@material-ui/core";

function getMuiTheme(): ThemeOptions {
	return createMuiTheme({
		palette: {
			primary: {
				main: "#212945",
			},
			secondary: {
				main: "#5567ff",
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
