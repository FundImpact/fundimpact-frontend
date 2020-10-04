import React, { useState } from "react";
import UserRoleForm from "../../../components/Forms/UserRole";
import { Box, Grid, Paper, Typography, Fab, Chip, Avatar } from "@material-ui/core";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import InvitedUserTable from "../../../components/Table/InvitedUser";
import RoleTable from "../../../components/Table/RoleTable";
import AddButton from "../../../components/Dasboard/AddButton";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/userContext";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { USER_PERMISSIONS_ACTIONS } from "../../../utils/access/modules/userPermissions/actions";
import { AUTH_ACTIONS } from "../../../utils/access/modules/auth/actions";
import FilterList from "../../../components/FilterList";
import { roleInputFields } from "./inputFields.json";

const chipArray = ({
	tableFilterList,
	removeFilteListElements,
}: {
	tableFilterList: {
		[key: string]: string;
	};
	removeFilteListElements: (elementToDelete: string | number) => void;
}) => {
	return (
		<Box display="flex">
			{Object.entries(tableFilterList).map(
				(tableFilterListObjectKeyValuePair, index) =>
					tableFilterListObjectKeyValuePair[1] && (
						<Box key={index} mx={1}>
							<Chip
								label={tableFilterListObjectKeyValuePair[1]}
								avatar={
									<Avatar
										style={{
											width: "30px",
											height: "30px",
										}}
									>
										<span>
											{tableFilterListObjectKeyValuePair[0].slice(0, 4)}
										</span>
									</Avatar>
								}
								onDelete={() =>
									removeFilteListElements(tableFilterListObjectKeyValuePair[0])
								}
							/>
						</Box>
					)
			)}
		</Box>
	);
};

export const UserRoleContainer = () => {
	const user = useAuth();

	const [tableFilterList, setTableFilterList] = useState<{
		[key: string]: string;
	}>({
		name: "",
	});

	const removeFilteListElements = (elementToDelete: keyof { [key: string]: string }) => {
		setTableFilterList((filterListObject) => {
			filterListObject[elementToDelete] = "";
			return { ...filterListObject };
		});
	};

	const userRoleFindAccess = userHasAccess(
		MODULE_CODES.USER_PERMISSIONS,
		USER_PERMISSIONS_ACTIONS.FIND_USER_PERMISSIONS
	);

	const userRoleCreateAccess = userHasAccess(
		MODULE_CODES.USER_PERMISSIONS,
		USER_PERMISSIONS_ACTIONS.CREATE_USER_PERMISSIONS
	);

	const authInviteUser = userHasAccess(MODULE_CODES.AUTH, AUTH_ACTIONS.INVITE_USER);

	return (
		<Box p={2}>
			<Grid container spacing={2}>
				{/* {authInviteUser && (
					<>
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
					</>
				)} */}
				{userRoleFindAccess && (
					<>
						<Grid item xs={11}>
							<Typography variant="h6">
								<FormattedMessage
									id={`rolesHeading`}
									defaultMessage={`Roles`}
									description={`This text will be shown on Setting page as heading og roles table`}
								/>
							</Typography>
						</Grid>
						<Grid item xs={1}>
							<FilterList
								setFilterList={setTableFilterList}
								inputFields={roleInputFields}
							/>
						</Grid>
						<Grid item xs={12}>
							{chipArray({ removeFilteListElements, tableFilterList })}
						</Grid>
						<Grid item xs={12}>
							<RoleTable tableFilterList={tableFilterList} />
						</Grid>
					</>
				)}
			</Grid>
			{userRoleCreateAccess && (
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
			)}
		</Box>
	);
};
