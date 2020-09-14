import { useQuery } from "@apollo/client";
import { Box, Divider, ListItem, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";

import { sidePanelStyles } from "../../components/Dasboard/styles";
import SidebarSkeleton from "../../components/Skeletons/SidebarSkeleton";
import { useDashBoardData, useDashboardDispatch } from "../../contexts/dashboardContext";
import { GET_ORGANISATIONS } from "../../graphql";
import { IOrganisationFetchResponse } from "../../models/organisation/query";
import { setOrganisation } from "../../reducers/dashboardReducer";
import { useIntl } from "react-intl";
import ListItemLink from "../../components/ListItemLink";
/**
 *
 * @description The to url must be relative to the /account.
 *
 * @example
 *   If to = 'profile', the generate url will be <ROOT>/settings/profile
 *   If to = 'reset-pass', the generate url will be <ROOT>/settings/reset-pass
 *
 * @param primary  will be the name which will be displayed on
 * the UI.
 */

export default function AccountSettingsSidebar({ children }: { children?: Function }) {
	const classes = sidePanelStyles();
	const { data: orgData } = useQuery<IOrganisationFetchResponse>(GET_ORGANISATIONS);
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	const intl = useIntl();
	React.useEffect(() => {
		if (orgData) {
			const { organizationList } = orgData;
			if (organizationList) {
				dispatch(setOrganisation(organizationList[0]));
			}
		}
	}, [orgData, dispatch]);

	if (!orgData?.organizationList) return <SidebarSkeleton />;
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			<Box display="flex" m={2}>
				<Box flexGrow={1} ml={1}>
					<Typography
						color="primary"
						gutterBottom
						variant="h6"
						data-testid="account-setting-sidebar-org"
					>
						{dashboardData?.organization?.name || "Organization name is not available"}
					</Typography>
				</Box>
			</Box>
			<Divider />
			<ListItemLink
				to="profile"
				data-testid="update-user-link"
				primary={intl.formatMessage({
					id: `profileSettingLink`,
					defaultMessage: "Profile",
					description: `This text will be shown for profile link on setting page`,
				})}
			></ListItemLink>
		</Box>
	);
}
