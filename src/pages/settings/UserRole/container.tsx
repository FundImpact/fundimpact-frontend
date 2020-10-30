import React, { useState } from "react";
import UserRoleForm from "../../../components/Forms/UserRole";
import { Box, Grid, Typography } from "@material-ui/core";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import InvitedUserTable from "../../../components/Table/InvitedUser";
import AddButton from "../../../components/Dasboard/AddButton";
import { AUTH_ACTIONS } from "../../../utils/access/modules/auth/actions";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import FilterListContainer from "../../../components/FilterList";
import { invitedUserFilter } from "./inputFields.json";

export const UserRoleContainer = () => {
	const authInviteUser = userHasAccess(MODULE_CODES.AUTH, AUTH_ACTIONS.INVITE_USER);
	const authFindUser = userHasAccess(MODULE_CODES.AUTH, AUTH_ACTIONS.FIND);
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		email: "",
		role: [],
	});

	return (
		<Box p={2}>
			<Grid md={12}>
				{authFindUser && (
					<Grid item xs={12} container justify="space-between">
						<Typography variant="h4">
							<Box mt={2} fontWeight="fontWeightBold">
								<FormattedMessage
									id={`invitedUserHeading`}
									defaultMessage={`Invited Users`}
									description={`This text will be shown on Setting page for invited user heading on role tab`}
								/>
							</Box>
						</Typography>

						<Box mt={2}>
							<FilterListContainer
								initialValues={{
									email: "",
									role: [],
								}}
								setFilterList={setFilterList}
								inputFields={invitedUserFilter}
							/>
						</Box>
					</Grid>
				)}
				<Box>
					{authFindUser && (
						<InvitedUserTable
							{...{
								filterList,
								setFilterList,
								invitedUserFilter,
							}}
						/>
					)}
				</Box>
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
