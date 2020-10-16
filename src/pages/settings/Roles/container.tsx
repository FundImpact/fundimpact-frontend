import React, { useState } from "react";
import { Box, Grid, Typography, Fab, Chip, Avatar } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import RoleTable from "../../../components/Table/RoleTable";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/userContext";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { USER_PERMISSIONS_ACTIONS } from "../../../utils/access/modules/userPermissions/actions";
import FilterList from "../../../components/FilterList";
import { roleInputFields } from "./inputFields.json";
import AddRoleForm from "../../../components/Forms/AddRoleForm";

// const chipArray = ({
// 	tableFilterList,
// 	removeFilteListElements,
// }: {
// 	tableFilterList: {
// 		[key: string]: string;
// 	};
// 	removeFilteListElements: (elementToDelete: string | number) => void;
// }) => {
// 	return (
// 		<Box display="flex">
// 			{Object.entries(tableFilterList).map(
// 				(tableFilterListObjectKeyValuePair, index) =>
// 					tableFilterListObjectKeyValuePair[1] && (
// 						<Box key={index} mx={1}>
// 							<Chip
// 								label={tableFilterListObjectKeyValuePair[1]}
// 								avatar={
// 									<Avatar
// 										style={{
// 											width: "30px",
// 											height: "30px",
// 										}}
// 									>
// 										<span>
// 											{tableFilterListObjectKeyValuePair[0].slice(0, 4)}
// 										</span>
// 									</Avatar>
// 								}
// 								onDelete={() =>
// 									removeFilteListElements(tableFilterListObjectKeyValuePair[0])
// 								}
// 							/>
// 						</Box>
// 					)
// 			)}
// 		</Box>
// 	);
// };

export const RolesContainer = () => {
	const [open, setOpen] = useState<boolean>(false);

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

	return (
		<Box>
			<Box p={2}>
				<Grid container spacing={2}>
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

							<Grid item xs={12}>
								<RoleTable tableFilterList={tableFilterList} />
							</Grid>
						</>
					)}
				</Grid>
				{userRoleCreateAccess && (
					<Fab
						style={{ position: "fixed", right: "0px", bottom: "10px" }}
						data-testid="add-role-button"
						color="primary"
						aria-label="add"
						disableRipple
						onClick={() => setOpen(true)}
					>
						<AddIcon />
					</Fab>
				)}
			</Box>
			<AddRoleForm open={open} handleClose={() => setOpen(false)} />
		</Box>
	);
};
