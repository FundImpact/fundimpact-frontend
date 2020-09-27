import React from "react";
import UserRoleForm from "../../../components/Forms/UserRole";
import { Box, Paper } from "@material-ui/core";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";

export const UserRoleContainer = () => {
	return (
		<Box>
			<h1>
				<FormattedMessage
					id={`userRoleHeading`}
					defaultMessage={`User Roles`}
					description={`This text will be shown on Setting page for user role heading`}
				/>
			</h1>
			<Paper style={{ height: "90vh" }}>
				<Box m={3} p={2}>
					<UserRoleForm type={FORM_ACTIONS.CREATE} />
				</Box>
			</Paper>
		</Box>
	);
};
