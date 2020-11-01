import { useQuery, useLazyQuery } from "@apollo/client";
import { Avatar, Box, Divider, Typography } from "@material-ui/core";
import React from "react";
import { sidePanelStyles } from "../../components/Dasboard/styles";
import SidebarSkeleton from "../../components/Skeletons/SidebarSkeleton";
import { useDashBoardData, useDashboardDispatch } from "../../contexts/dashboardContext";
import { GET_ORGANISATIONS } from "../../graphql";
import { IOrganisationFetchResponse } from "../../models/organisation/query";
import { setOrganisation } from "../../reducers/dashboardReducer";
import { useIntl } from "react-intl";
import ListItemLink from "../../components/ListItemLink";
import { userHasAccess, MODULE_CODES } from "../../utils/access";
import { ACCOUNT_ACTIONS } from "../../utils/access/modules/account/actions";
import { useAuth } from "../../contexts/userContext";
import { Link } from "react-router-dom";
/**
 *
 * @description The to url must be relative to the /account.
 *
 * @example
 *   If to = 'profile', the generate url will be <ROOT>/account/profile
 *   If to = 'reset-pass', the generate url will be <ROOT>/account/reset-pass
 *
 * @param primary  will be the name which will be displayed on
 * the UI.
 */

export default function AccountSettingsSidebar({ children }: { children?: Function }) {
	const classes = sidePanelStyles();
	const user = useAuth();
	const [getOrganization, { data: orgData }] = useLazyQuery<IOrganisationFetchResponse>(
		GET_ORGANISATIONS
	);
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	const intl = useIntl();

	React.useEffect(() => {
		if (user) {
			getOrganization({
				variables: {
					id: user.user?.organization.id,
				},
			});
		}
	}, [user, getOrganization]);

	React.useEffect(() => {
		if (orgData) {
			const { organization } = orgData;
			if (organization) {
				dispatch(setOrganisation(organization));
			}
		}
	}, [orgData, dispatch]);

	const accountEditAccess = userHasAccess(MODULE_CODES.ACCOUNT, ACCOUNT_ACTIONS.UPDATE_ACCOUNT);

	if (!orgData?.organization) return <SidebarSkeleton />;
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			<Box display="flex" m={2}>
				<Link to="/organization/dashboard" style={{ textDecoration: "none" }}>
					<Box flexGrow={1} ml={1} display="flex">
						{dashboardData?.organization?.name && (
							<>
								<Box mr={1}>
									<Avatar src={dashboardData?.organization?.logo?.url} />
								</Box>
								<Typography color="primary" gutterBottom variant="h6">
									{dashboardData?.organization?.name}
								</Typography>
							</>
						)}
					</Box>
				</Link>
			</Box>
			<Divider />
			{accountEditAccess && (
				<ListItemLink
					to="profile"
					data-testid="update-user-link"
					primary={intl.formatMessage({
						id: `profileSettingLink`,
						defaultMessage: "Profile",
						description: `This text will be shown for profile link on setting page`,
					})}
				></ListItemLink>
			)}
		</Box>
	);
}
