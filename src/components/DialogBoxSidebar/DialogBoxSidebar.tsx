import React from "react";
import { Grid, Typography, Box } from "@material-ui/core";

function DialogBoxSidebar({
	title,
	subtitle,
	workspace,
}: {
	title: string;
	subtitle: string;
	workspace: string;
}) {
	return (
		<Grid container>
			<Grid xs={12} item>
				<Typography
					data-testid="dialog-header"
					variant="h6"
					gutterBottom
				>
					{title}
				</Typography>
				<Typography variant="subtitle2" color="textSecondary" gutterBottom>
					{subtitle}
				</Typography>
				<Box p={3} mt={3} style={{ backgroundColor: "#F5F6FA" }}>
					<Typography color="primary" gutterBottom>
						{workspace}
					</Typography>
					<Box mt={1}>
						<Typography variant="subtitle2">Project Name One</Typography>
					</Box>
				</Box>
			</Grid>
		</Grid>
	);
}

export default DialogBoxSidebar;
