import React from "react";
import UserRoleForm from "../../../components/Forms/UserRole";
import { Box, Grid, Paper, Typography } from "@material-ui/core";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import InvitedUserTable from "../../../components/Table/InvitedUser";
import AddButton from "../../../components/Dasboard/AddButton";
export const UserRoleContainer = () => {
	return (
		<Box>
			{/* <Box m={1}>
				<Typography variant="h6">
					<FormattedMessage
						id={`userRoleHeading`}
						defaultMessage={`User Roles`}
						description={`This text will be shown on Setting page for user role heading`}
					/>
				</Typography>
			</Box> */}

			{/* <Grid item md={12}>
				<Paper style={{ height: "250px" }}>
					<Box m={1} p={3}>
						<UserRoleForm type={FORM_ACTIONS.CREATE} />
					</Box>
				</Paper>
			</Grid> */}
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
				<Box>
					<InvitedUserTable />
				</Box>
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
			</Grid>
		</Box>
	);
};
