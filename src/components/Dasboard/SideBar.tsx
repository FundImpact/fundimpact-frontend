import React from "react";
import { Box } from "@material-ui/core";
import { useStyles } from "./styles";

export default function SideBar({ children }: { children: React.ReactElement }) {
	const classes = useStyles();

	return (
		<Box className={classes.sidePanel} ml={2} mr={1} p={2}>
			{children}
		</Box>
	);
}
