import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";

export const FormDetails = ({
	formDetails,
	title,
}: {
	formDetails: { label: string; value: string }[];
	title: string;
}) => {
	// const theme = useTheme();
	return (
		<Grid container>
			<Grid item xs={12}>
				<Box mt={1}>
					<Typography color="textSecondary" align="center">
						<Box fontWeight="bolder">{title.toUpperCase()}</Box>
					</Typography>
				</Box>
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
