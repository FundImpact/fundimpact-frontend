import { Box, Grid } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { BUDGET_TARGET_ACTIONS } from "../../../utils/access/modules/budgetTarget/actions";
import { DELIVERABLE_TARGET_ACTIONS } from "../../../utils/access/modules/deliverableTarget/actions";
import { IMPACT_TARGET_ACTIONS } from "../../../utils/access/modules/impactTarget/actions";
import Achievement from "../Cards/Achievement/Achievement";
import { CARD_TYPES } from "../Cards/constants";
import DashboardCard from "../Cards/DasboardCards";
import FundStatus from "../Cards/FundStatus/FundStatus";
import Impact from "../Cards/Impact/Impact";
import ProjectName from "../ProjectName/ProjectName";
import DashboardTableContainer from "../Table/DashboardTableContainer";

export default function MainDashboard() {
	const intl = useIntl();

	const budgetTargetFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.FIND_BUDGET_TARGET
	);
	const deliverableTargetFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.FIND_DELIVERABLE_TARGET
	);
	const impactTargetFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.FIND_IMPACT_TARGET
	);

	return (
		<>
			<Grid item>
				<ProjectName />
			</Grid>

			<Grid item container style={{ flex: 1.5 }}>
				{budgetTargetFindAccess && (
					<Grid item md={4}>
						<DashboardCard
							title={intl.formatMessage({
								id: "fundStatusCardTitle",
								defaultMessage: "FUND STATUS ",
								description: `This text will be show on dashboard for fund status card title`,
							})}
							type={CARD_TYPES.DEFAULT}
							tooltip={intl.formatMessage({
								id: "fundStatusCardTooltip",
								defaultMessage:
									"This card is showing total fund spend, received and expenditure made for",
								description:
									"This text will be show on dashboard for fund status card tooltip",
							})}
							hideDonorAndFinancialYearFilter={true}
						>
							<FundStatus />
						</DashboardCard>
					</Grid>
				)}
				{(impactTargetFindAccess || deliverableTargetFindAccess) && (
					<Grid item md={8}>
						<DashboardCard
							title={intl.formatMessage({
								id: "achievementCardTitle",
								defaultMessage: "ACHIEVEMENT",
								description: `This text will be show on dashboard for achievement card title`,
							})}
							type={CARD_TYPES.DEFAULT}
							tooltip={intl.formatMessage({
								id: "achievementCardTooltip",
								defaultMessage:
									"This card is showing total deliverable target, Outcome, Output and Impact for",
								description:
									"This text will be show on dashboard for fund status card tooltip",
							})}
							hideDonorAndFinancialYearFilter={true}
						>
							<Achievement />
						</DashboardCard>
					</Grid>
				)}
				{/* {impactTargetFindAccess && (
					<Grid item md={4}>
						<DashboardCard
							title={intl.formatMessage({
								id: "impactCardTitle",
								defaultMessage: "IMPACT",
								description: `This text will be show on dashboard for impacts card title`,
							})}
							type={CARD_TYPES.DEFAULT}
							tooltip={intl.formatMessage({
								id: "impactCardTooltip",
								defaultMessage:
									"This card is showing count of sustainable development goals achieved for",
								description:
									"This text will be show on dashboard for impacts card tooltip",
							})}
							hideDonorAndFinancialYearFilter={true}
						>
							<Impact />
						</DashboardCard>
					</Grid>
				)} */}
			</Grid>
			<Grid item style={{ flex: 4 }}>
				<Box ml={1}>
					<DashboardTableContainer />
				</Box>
			</Grid>
		</>
	);
}
