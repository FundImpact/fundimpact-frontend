import { useQuery } from "@apollo/client";
import { Box, Divider, ListItem, ListItemText, Typography, Avatar } from "@material-ui/core";
import React from "react";
import { NavLink } from "react-router-dom";

import { sidePanelStyles } from "../../components/Dasboard/styles";
import SidebarSkeleton from "../../components/Skeletons/SidebarSkeleton";
import { useDashBoardData, useDashboardDispatch } from "../../contexts/dashboardContext";
import { GET_ORGANISATIONS } from "../../graphql";
import { IOrganisationFetchResponse } from "../../models/organisation/query";
import { setOrganisation } from "../../reducers/dashboardReducer";
import { useIntl } from "react-intl";
import { sidebarList } from "./sidebarList";
import ListItemLink from "../../components/ListItemLink";
import { userHasAccess, MODULE_CODES } from "../../utils/access";
import { BUDGET_CATEGORY_ACTIONS } from "../../utils/access/modules/budgetCategory/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../utils/access/modules/deliverableCategory/actions";
import { DELIVERABLE_UNIT_ACTIONS } from "../../utils/access/modules/deliverableUnit/actions";
import { IMPACT_CATEGORY_ACTIONS } from "../../utils/access/modules/impactCategory/actions";
import { IMPACT_UNIT_ACTIONS } from "../../utils/access/modules/impactUnit/actions";

const setSidebarBudgetCategoryUserAccess = (
	budgetCategory: { userAccess: boolean },
	userAccess: boolean
) => (budgetCategory.userAccess = userAccess);

const setSidebarDeliverableCategoryAndUnitsUserAccess = (
	deliverableCategoryAndUnits: { userAccess: boolean },
	userAccess: boolean
) => {
	deliverableCategoryAndUnits.userAccess = userAccess;
};

const setSidebarImpactCategoryAndUnitsUserAccess = (
	impactCategoryAndUnits: { userAccess: boolean },
	userAccess: boolean
) => {
	impactCategoryAndUnits.userAccess = userAccess;
};

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

export default function SettingsSidebar({ children }: { children?: Function }) {
	const classes = sidePanelStyles();
	const { data } = useQuery<IOrganisationFetchResponse>(GET_ORGANISATIONS);
	const dispatch = useDashboardDispatch();
	const dashboardData = useDashBoardData();
	const intl = useIntl();
	React.useEffect(() => {
		if (data) {
			const { organizationList } = data;
			if (organizationList) {
				dispatch(setOrganisation(organizationList[0]));
			}
		}
	}, [data, dispatch]);

	const budgetCategoryFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.FIND_BUDGET_CATEGORY
	);

	const deliverableCategoryFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	const deliverableUnitFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.FIND_DELIVERABLE_UNIT
	);

	const impactCategoryFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.FIND_IMPACT_CATEGORY
	);

	const impactUnitFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.FIND_IMPACT_UNIT
	);

	setSidebarBudgetCategoryUserAccess(sidebarList[2].subHeadings[0], budgetCategoryFindAccess);
	setSidebarDeliverableCategoryAndUnitsUserAccess(
		sidebarList[2].subHeadings[2],
		deliverableCategoryFindAccess || deliverableUnitFindAccess
	);
	setSidebarImpactCategoryAndUnitsUserAccess(
		sidebarList[2].subHeadings[1],
		impactCategoryFindAccess || impactUnitFindAccess
	);

	if (!data?.organizationList) return <SidebarSkeleton></SidebarSkeleton>;
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			<Box display="flex" m={2}>
				<Box flexGrow={1} ml={1} display="flex">
					<Box mr={1}>
						<Avatar src={dashboardData?.organization?.logo?.url} />
					</Box>
					<Typography color="primary" gutterBottom variant="h6">
						{dashboardData?.organization?.name || ""}
					</Typography>
				</Box>
			</Box>
			<Divider />
			{sidebarList.map(
				(
					listItem: {
						mainHeading: string;
						subHeadings: {
							to: string;
							dataTestId: string;
							title: string;
							userAccess: boolean;
						}[];
					},
					index
				) => (
					<React.Fragment key={index}>
						{listItem.mainHeading && (
							<Box display="flex">
								<Box p={2}>
									<ListItemText
										primary={listItem.mainHeading}
										className={classes.mainHeading}
									/>
								</Box>
							</Box>
						)}
						{listItem.subHeadings.map(
							(subHeading, subHeadingIndex) =>
								subHeading.userAccess && (
									<ListItemLink
										to={subHeading.to}
										data-testid={subHeading.dataTestId}
										primary={subHeading.title}
										key={subHeadingIndex}
									/>
								)
						)}
					</React.Fragment>
				)
			)}
		</Box>
	);
}
