import React, { useState } from "react";
import {
	createMuiTheme,
	ThemeOptions,
	CssBaseline,
	ThemeProvider,
	SimplePaletteColorOptions,
} from "@material-ui/core";
import { useAuth } from "./userContext";
import { useDashBoardData } from "./dashboardContext";
import { primaryColor, secondaryColor } from "../models/constants";

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
					tspan: {
						fill: `rgb(144,144,144) !important`,
					},
				},
			},
		},
	};
};

function getMuiTheme(
	theme: ThemeOptions | undefined | null,
	themePaletteType: "dark" | "light"
): ThemeOptions {
	const globalStyleOverride = getGlobalStylesOverride(
		(theme?.palette?.primary as SimplePaletteColorOptions)?.main || primaryColor
	);

	if (theme) {
		return createMuiTheme(
			Object.assign({}, theme, globalStyleOverride, {
				palette: { ...theme?.palette, type: themePaletteType },
			})
		);
	}

	return createMuiTheme({
		...globalStyleOverride,
		palette: {
			type: themePaletteType,
			primary: {
				main: primaryColor,
			},
			secondary: {
				main: secondaryColor,
			},
		},
	});
}

function UIProvider({ children }: any) {
	const dashboardData = useDashBoardData();
	const { user } = useAuth();

	const theme = getMuiTheme(
		dashboardData?.organization?.theme,
		user?.theme?.palette?.type || "light"
	);
	return (
		<ThemeProvider theme={{ ...theme }}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}

export { UIProvider };
