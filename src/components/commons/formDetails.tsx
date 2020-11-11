import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";

export const FormDetails = ({
	formDetails,
}: {
	formDetails: { label: string; value: string }[];
}) => {
	// const theme = useTheme();
	return (
		<Grid container>
			<Grid item xs={12}>
				{formDetails?.map((detail: { label: string; value: string }) => (
					<Box py={2} display="flex" justifyContent="space-between">
						<Typography color="primary">{detail.label}</Typography>
						<Typography>{detail.value}</Typography>
					</Box>
				))}
			</Grid>
		</Grid>
	);
};
