import React from "react";
import { Box, Grid, Typography, Paper } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import AddRoleForm from "../../../components/Forms/AddRoleForm";

function AddRoleView() {
	return (
		<Box p={2}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h5">
						<FormattedMessage
							id={`addRoleHeading`}
							defaultMessage={`Add Role`}
							description={`This text will be shown on Setting page for add role heading`}
						/>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Paper>
						<Box p={2}>
				
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

export default AddRoleView;
