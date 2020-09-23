import React, { useState } from "react";
import {
	createMuiTheme,
	ThemeOptions,
	CssBaseline,
	ThemeProvider,
	SimplePaletteColorOptions,
} from "@material-ui/core";
import { useAuth } from "./userContext";

const getGlobalStylesOverride = (primaryColor: string) => {
	return {
		overrides: {
			MuiCssBaseline: {
				"@global": {
					"*::-webkit-scrollbar": {
						width: "8px",
					},
					"*::-webkit-scrollbar-track": {
						background: "rgba(0, 0, 0, 0.08)",
					},
					"*::-webkit-scrollbar-corner": {
						background: "rgba(0, 0, 0, 0.08)",
					},
					"*::-webkit-scrollbar-thumb": {
						backgroundColor: primaryColor,
						borderRadius: "50px",
					},
				},
			},
		},
	};
};

function getMuiTheme(theme: ThemeOptions | undefined | null): ThemeOptions {
	const globalStyleOverride = getGlobalStylesOverride(
		(theme?.palette?.primary as SimplePaletteColorOptions)?.main || "rgb(85, 103, 255)"
	);

	if (theme) {
		return createMuiTheme(Object.assign({}, theme, globalStyleOverride));
	}

	return createMuiTheme({
		...globalStyleOverride,
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
		<ThemeProvider theme={{ ...theme }}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}

export { UIProvider };
