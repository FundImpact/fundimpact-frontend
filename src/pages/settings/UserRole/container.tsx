import React from "react";
import UserRoleForm from "../../../components/Forms/UserRole";
import { Box, Grid, Paper, Typography, Fab } from "@material-ui/core";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import InvitedUserTable from "../../../components/Table/InvitedUser";
import RoleTable from "../../../components/Table/RoleTable";
import AddButton from "../../../components/Dasboard/AddButton";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/userContext";

export const UserRoleContainer = () => {
	const user = useAuth();

	return (
		<Box p={2}>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Typography variant="h6">
						<FormattedMessage
							id={`userRoleHeading`}
							defaultMessage={`User Roles`}
							description={`This text will be shown on Setting page for user role heading`}
						/>
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<Paper style={{ height: "250px" }}>
						<Box p={2}>
							<UserRoleForm type={FORM_ACTIONS.CREATE} />
						</Box>
					</Paper>
				</Grid>
				<Grid item xs={12}>
					<Typography variant="h6">
						<FormattedMessage
							id={`rolesHeading`}
							defaultMessage={`Roles`}
							description={`This text will be shown on Setting page as heading og roles table`}
						/>
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<RoleTable />
				</Grid>
			</Grid>
			<Link to={{ pathname: "/settings/add_role" }}>
				<Fab
					style={{ position: "fixed", right: "10px", bottom: "10px" }}
					data-testid="add-role-button"
					color="primary"
					aria-label="add"
					disableRipple
				>
					<AddIcon />
				</Fab>
			</Link>
		</Box>
	);
};
