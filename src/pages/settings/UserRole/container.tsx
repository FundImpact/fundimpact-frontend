import React from "react";
import UserRoleForm from "../../../components/Forms/UserRole";
import { Box, Grid, Typography } from "@material-ui/core";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import InvitedUserTable from "../../../components/Table/InvitedUser";
import AddButton from "../../../components/Dasboard/AddButton";
import { AUTH_ACTIONS } from "../../../utils/access/modules/auth/actions";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";

export const UserRoleContainer = () => {
	const authInviteUser = userHasAccess(MODULE_CODES.AUTH, AUTH_ACTIONS.INVITE_USER);
	const authFindUser = userHasAccess(MODULE_CODES.AUTH, AUTH_ACTIONS.FIND);

	return (
		<Box>
			<Grid md={12}>
				<Box m={1} mb={0}>
					<Typography variant="h6">
						<FormattedMessage
							id={`invitedUserHeading`}
							defaultMessage={`Invited Users`}
							description={`This text will be shown on Setting page for invited user heading on role tab`}
						/>
					</Typography>
				</Box>
				<Box>{authFindUser && <InvitedUserTable />}</Box>
				{authInviteUser && (
					<AddButton
						createButtons={[]}
						buttonAction={{
							dialog: ({
								open,
								handleClose,
							}: {
								open: boolean;
								handleClose: () => void;
							}) => (
								<UserRoleForm
									open={open}
									handleClose={handleClose}
									type={FORM_ACTIONS.CREATE}
								/>
							),
						}}
					/>
				)}
			</Grid>
		</Box>
	);
};
