import { Box, CircularProgress } from "@material-ui/core";
import React from "react";

interface IFullScreenLoaderProps {
	children?: React.ReactNode;
}

function FullScreenLoader({ children }: IFullScreenLoaderProps) {
	return (
		<Box
			height={"100vh"}
			width={"100vw"}
			justifyContent="center"
			alignItems="center"
			display="flex"
		>
			{children ? children : <CircularProgress />}
		</Box>
	);
}

export { FullScreenLoader };
