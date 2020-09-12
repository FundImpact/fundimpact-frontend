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
import sideBarList from "./sidebarList.json";

/**
 *
 * @description The to url must be relative to the /settings.
 *
 * @example
 *   If to = 'icons', the generate url will be <ROOT>/settings/icons
 *   If to = 'achievements', the generate url will be <ROOT>/settings/achievements
 *   If to = 'edits', the generate url will be <ROOT>/settings/edits
 *   If to = 'icons', the generate url will be <ROOT>/settings/icons
 *
 * @param primary  will be the name which will be displayed on
 * the UI.
 */
function ListItemLink(props: { primary: string; to: string }) {
	const { primary, to } = props;
	const { sidePanelActiveLink } = sidePanelStyles();

	const CustomLink = React.useMemo(
		() =>
			React.forwardRef((linkProps, ref) => (
				<NavLink activeClassName={sidePanelActiveLink} to={to} {...linkProps} />
			)),
		[to]
	);

	return (
		<ListItem button component={CustomLink}>
			<ListItemText primary={primary} />
		</ListItem>
	);
}

export default function SettingsSidebar({ children }: { children?: Function }) {
	const classes = sidePanelStyles();
	const { data } = useQuery<IOrganisationFetchResponse>(GET_ORGANISATIONS);
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();

	React.useEffect(() => {
		if (data) {
			const { organizationList } = data;
			if (organizationList) {
				dispatch(setOrganisation(organizationList[0]));
			}
		}
	}, [data, dispatch]);

	if (!data?.organizationList) return <SidebarSkeleton></SidebarSkeleton>;
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			<Box display="flex" m={2}>
				<Box flexGrow={1} ml={1}>
					<Typography color="primary" gutterBottom variant="h6">
						{dashboardData?.organization?.name || "Organization name is not available"}
					</Typography>
				</Box>
			</Box>
			<Divider />

			<ListItemLink to="donors" data-testid="donor-link" primary="Donors"></ListItemLink>
			<ListItemLink
				to="profile"
				data-testid="update-user-link"
				primary="Update Profile"
			></ListItemLink>
			{sideBarList.map(
				(
					listItem: {
						mainHeading: string;
						subHeadings: { to: string; dataTestId: string; title: string }[];
					},
					index
				) => (
					<>
						<Box display="flex" key={index}>
							<Box p={2}>
								<ListItemText
									primary={listItem.mainHeading}
									className={classes.mainHeading}
								/>
							</Box>
						</Box>
						{listItem.subHeadings.map((subHeading, subHeadingIndex) => (
							<ListItemLink
								to={subHeading.to}
								data-testid={subHeading.dataTestId}
								primary={subHeading.title}
								key={subHeadingIndex}
							/>
						))}
					</>
				)
			)}
		</Box>
	);
}
