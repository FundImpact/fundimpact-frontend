import { Box, makeStyles, Tab, Tabs, Theme } from "@material-ui/core";
import React, { useEffect } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useNotificationData } from "../../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../../models/constants";
import BudgetCategory from "../../Budget/BudgetCategory";
import BudgetLineitem from "../../Budget/BudgetLineitem";
import BudgetTarget from "../../Budget/BudgetTarget";
import AddButton from "../../Dasboard/AddButton";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import Deliverable from "../../Deliverable/Deliverable";
import DeliverableTarget from "../../Deliverable/DeliverableTarget";
import DeliverableTrackLine from "../../Deliverable/DeliverableTrackline";
import DeliverableUnit from "../../Deliverable/DeliverableUnit";
import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import ImpactTarget from "../../Impact/impactTarget";
import ImpactTrackLine from "../../Impact/impactTrackLine";
import ImpactUnitDialog from "../../Impact/ImpactUnitDialog";
import Snackbar from "../../Snackbar/Snackbar";
import BudgetTargetTable from "../../Table/Budget/BudgetTargetTable";
import DeliverablesTable from "../../Table/Deliverable/Deliverable";
import GrantPeriodTable from "../../Table/GrantPeriod/GrantPeriodTable";
import ImpactsTable from "../../Table/Impact/Impacts";
import { useIntl } from "react-intl";
import { CreateButton } from "../../../models/addButton";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { BUDGET_TARGET_ACTIONS } from "../../../utils/access/modules/budgetTarget/actions";
import { BUDGET_CATEGORY_ACTIONS } from "../../../utils/access/modules/budgetCategory/actions";
import { BUDGET_TARGET_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/budgetTargetLineItem/actions";
import { IMPACT_CATEGORY_ACTIONS } from "../../../utils/access/modules/impactCategory/actions";
import { IMPACT_UNIT_ACTIONS } from "../../../utils/access/modules/impactUnit/actions";
import { IMPACT_TRACKING_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/impactTrackingLineItem/actions";
import { IMPACT_TARGET_ACTIONS } from "../../../utils/access/modules/impactTarget/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_TARGET_ACTIONS } from "../../../utils/access/modules/deliverableTarget/actions";
import { DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS } from "../../../utils/access/modules/deliverableTrackingLineItem/actions";
import { GRANT_PERIOD_ACTIONS } from "../../../utils/access/modules/grantPeriod/actions";
import FundReceived from "../../FundReceived";
import { FUND_RECEIPT_ACTIONS } from "../../../utils/access/modules/fundReceipt/actions";
import FundReceivedTable from "../../Table/FundReceivedTable";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function TabContent(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`wrapped-tabpanel-${index}`}
			aria-labelledby={`wrapped-tab-${index}`}
			{...other}
		>
			{value === index && <Box p={1}>{children}</Box>}
		</div>
	);
}

function a11yProps(index: any) {
	return {
		id: `wrapped-tab-${index}`,
		"aria-controls": `wrapped-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		//flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		height: "100%",
		overflow: "scroll",
	},
	contentHeading: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		margin: theme.spacing(1),
		marginLeft: theme.spacing(2),
	},
	button: {
		margin: theme.spacing(1),
		color: theme.palette.common.white,
	},
}));

const filterCreateButtonsAccordingToUserAccess = (createButtons: CreateButton[]) =>
	createButtons.filter((createButton) => createButton.createButtonAccess);

enum tabType {
	budgetTab = 0,
	deliverableTab = 1,
	impactTab = 2,
	grantPeriodTab = 3,
	fundReceiptTab = 3,
}

const getTabToShow = (
	budgetTabVisibility: boolean,
	impactTabVisibility: boolean,
	deliverableTabVisibility: boolean,
	grantPeriodTabVisibility: boolean,
	fundReceiptTabVisibility: boolean
) => {
	if (budgetTabVisibility) {
		return tabType.budgetTab;
	}
	if (deliverableTabVisibility) {
		return tabType.deliverableTab;
	}
	if (impactTabVisibility) {
		return tabType.impactTab;
	}
	if (grantPeriodTabVisibility) {
		return tabType.grantPeriodTab;
	}
	if (fundReceiptTabVisibility) {
		return tabType.fundReceiptTab;
	}
	return tabType.budgetTab;
};

export default function DashboardTableContainer() {
	const intl = useIntl();
	const dashboardData = useDashBoardData();

	const budgetTargetCreateAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.CREATE_BUDGET_TARGET
	);

	const budgetTargetFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET,
		BUDGET_TARGET_ACTIONS.FIND_BUDGET_TARGET
	);

	const budgetCategoryCreateAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.CREATE_BUDGET_CATEGORY
	);
	const budgetTargetLineItemCreateAccess = userHasAccess(
		MODULE_CODES.BUDGET_TARGET_LINE_ITEM,
		BUDGET_TARGET_LINE_ITEM_ACTIONS.CREATE_BUDGET_TARGET_LINE_ITEM
	);
	const impactCategoryCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.CREATE_IMPACT_CATEGORY
	);
	const impactUnitCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.CREATE_IMPACT_UNIT
	);
	const impactTargetCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.CREATE_IMPACT_TARGET
	);

	const impactTargetFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.FIND_IMPACT_TARGET
	);

	const impactTracklineCreateAccess = userHasAccess(
		MODULE_CODES.IMPACT_TRACKING_LINE_ITEM,
		IMPACT_TRACKING_LINE_ITEM_ACTIONS.CREATE_IMPACT_TRACKING_LINE_ITEM
	);
	const deliverableCategoryCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.CREATE_DELIVERABLE_CATEGORY
	);
	const deliverableUnitCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.CREATE_DELIVERABLE_UNIT
	);
	const deliverableTargetCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.CREATE_DELIVERABLE_TARGET
	);

	const deliverableTargetFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.FIND_DELIVERABLE_TARGET
	);

	const deliverableTracklineCreateAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM,
		DELIVERABLE_TRACKING_LINE_ITEM_ACTIONS.CREATE_DELIVERABLE_TRACKING_LINE_ITEM
	);

	const grantPeriodCreateAccess = userHasAccess(
		MODULE_CODES.GRANT_PERIOD,
		GRANT_PERIOD_ACTIONS.CREATE_GRANT_PERIOD
	);

	const grantPeriodFindAccess = userHasAccess(
		MODULE_CODES.GRANT_PERIOD,
		GRANT_PERIOD_ACTIONS.FIND_GRANT_PERIOD
	);

	const fundReceiptCreateAccess = userHasAccess(
		MODULE_CODES.FUND_RECEIPT,
		FUND_RECEIPT_ACTIONS.CREATE_FUND_RECEIPT
	);

	const fundReceiptFindAccess = userHasAccess(
		MODULE_CODES.FUND_RECEIPT,
		FUND_RECEIPT_ACTIONS.FIND_FUND_RECEIPT
	);

	const tabs = [
		{
			label: intl.formatMessage({
				id: "budgetTabHeading",
				defaultMessage: "Budget",
				description: `This text will be show on tab for Budget`,
			}),
			table: <BudgetTargetTable />,
			createButtons: [
				{
					text: intl.formatMessage({
						id: "createBudgetCategory",
						defaultMessage: "Create Budget Category",
						description: `This text will be show on Add Button for create Budget Category`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<BudgetCategory
							open={open}
							handleClose={handleClose}
							formAction={FORM_ACTIONS.CREATE}
						/>
					),
					createButtonAccess: budgetCategoryCreateAccess,
				},
				{
					text: intl.formatMessage({
						id: "createBudgetTarget",
						defaultMessage: "Create Budget Target",
						description: `This text will be show on Add Button for create Budget Target`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<BudgetTarget
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
					createButtonAccess: budgetTargetCreateAccess,
				},
				// { text: "Report Fund Receipt" },
				{
					text: intl.formatMessage({
						id: "reportBudgetSpend",
						defaultMessage: "Report Budget Spend",
						description: `This text will be show on Add Button for Report Budget Spend`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<BudgetLineitem
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
					createButtonAccess: budgetTargetLineItemCreateAccess,
				},
			],
			tabVisibility:
				budgetTargetFindAccess ||
				budgetCategoryCreateAccess ||
				budgetTargetCreateAccess ||
				budgetTargetLineItemCreateAccess,
			tableVisibility: budgetTargetFindAccess,
		},
		{
			label: intl.formatMessage({
				id: "deliverableTabHeading",
				defaultMessage: "Deliverable",
				description: `This text will be show on tab for Deliverables`,
			}),
			table: <DeliverablesTable />,
			createButtons: [
				{
					text: intl.formatMessage({
						id: "createDeliverableTarget",
						defaultMessage: "Create Deliverable Target",
						description: `This text will be show on Add Button for create Deliverable Target`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<DeliverableTarget
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
							project={dashboardData?.project?.id}
						/>
					),
					createButtonAccess: deliverableTargetCreateAccess,
				},
				{
					text: intl.formatMessage({
						id: "createDeliverableUnit",
						defaultMessage: "Create Deliverable Unit",
						description: `This text will be show on Add Button for create Deliverable Unit`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<DeliverableUnit
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
							organization={dashboardData?.organization?.id}
						/>
					),
					createButtonAccess: deliverableUnitCreateAccess,
				},
				{
					text: intl.formatMessage({
						id: "createDeliverableCategory",
						defaultMessage: "Create Deliverable Category",
						description: `This text will be show on Add Button for create Deliverable Category`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<Deliverable
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
							organization={dashboardData?.organization?.id}
						/>
					),
					createButtonAccess: deliverableCategoryCreateAccess,
				},
				{
					text: intl.formatMessage({
						id: "reportAchievement",
						defaultMessage: "Report Achievement",
						description: `This text will be show on Add Button for Report Achievement`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<DeliverableTrackLine
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
					createButtonAccess: deliverableTracklineCreateAccess,
				},
			],
			tabVisibility:
				deliverableTargetFindAccess ||
				deliverableTargetCreateAccess ||
				deliverableUnitCreateAccess ||
				deliverableCategoryCreateAccess ||
				deliverableTracklineCreateAccess,
			tableVisibility: deliverableTargetFindAccess,
		},
		{
			label: intl.formatMessage({
				id: "impactTabHeading",
				defaultMessage: "Impact",
				description: `This text will be show on tab for Impact`,
			}),
			table: <ImpactsTable />,
			createButtons: [
				{
					text: intl.formatMessage({
						id: "createImpactTarget",
						defaultMessage: "Create Impact Target",
						description: `This text will be show on Add Button for Create Impact Target`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<ImpactTarget
							type={IMPACT_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
							project={dashboardData?.project?.id}
						/>
					),
					createButtonAccess: impactTargetCreateAccess,
				},
				{
					text: intl.formatMessage({
						id: "createImpactUnit",
						defaultMessage: "Create Impact Unit",
						description: `This text will be show on Add Button for Create Impact Unit`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<ImpactUnitDialog
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
					createButtonAccess: impactUnitCreateAccess,
				},
				{
					text: intl.formatMessage({
						id: "createImpactCategory",
						defaultMessage: "Create Impact Category",
						description: `This text will be show on Add Button for Create Impact Category`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<ImpactCategoryDialog
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
					createButtonAccess: impactCategoryCreateAccess,
				},
				{
					text: intl.formatMessage({
						id: "reportAchievement",
						defaultMessage: "Report Achievement",
						description: `This text will be show on Add Button for Report Achievement`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<ImpactTrackLine
							open={open}
							handleClose={handleClose}
							type={IMPACT_ACTIONS.CREATE}
						/>
					),
					createButtonAccess: impactTracklineCreateAccess,
				},
			],
			tabVisibility:
				impactTargetFindAccess ||
				impactTargetCreateAccess ||
				impactUnitCreateAccess ||
				impactCategoryCreateAccess ||
				impactTracklineCreateAccess,
			tableVisibility: impactTargetFindAccess,
		},
		{
			label: intl.formatMessage({
				id: "fundReceivedTabHeading",
				defaultMessage: "Fund Received",
				description: `This text will be show on tab for fund received`,
			}),
			table: <FundReceivedTable />,
			createButtons: [
				{
					text: intl.formatMessage({
						id: "reportFundReceived",
						defaultMessage: "Report Fund Received",
						description: `This text will be show on Add Button for Report Fund Received`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<FundReceived
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
					createButtonAccess: fundReceiptCreateAccess,
				},
			],
			tabVisibility: fundReceiptFindAccess || fundReceiptCreateAccess,
			tableVisibility: fundReceiptFindAccess,
		},
		{
			label: intl.formatMessage({
				id: "grantPeriodTabHeading",
				defaultMessage: "Grant Periods",
				description: `This text will be show on tab for grant period`,
			}),
			table: <GrantPeriodTable />,
			createButtons: [
				{
					text: intl.formatMessage({
						id: "createGrantPeriod",
						defaultMessage: "Create Grant Period",
						description: `This text will be show on Add Button for Create Grant Period`,
					}),
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<GrantPeriodDialog
							open={open}
							onClose={handleClose}
							action={FORM_ACTIONS.CREATE}
						/>
					),
					createButtonAccess: grantPeriodCreateAccess,
				},
			],
			tabVisibility: grantPeriodFindAccess || grantPeriodCreateAccess,
			tableVisibility: grantPeriodFindAccess,
		},
	];
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const notificationData = useNotificationData();

	useEffect(() => {
		if (
			budgetTargetFindAccess ||
			budgetCategoryCreateAccess ||
			budgetTargetCreateAccess ||
			budgetTargetLineItemCreateAccess ||
			fundReceiptCreateAccess ||
			impactTargetFindAccess ||
			impactTargetCreateAccess ||
			impactUnitCreateAccess ||
			impactCategoryCreateAccess ||
			impactTracklineCreateAccess ||
			deliverableTargetFindAccess ||
			deliverableTargetCreateAccess ||
			deliverableUnitCreateAccess ||
			deliverableCategoryCreateAccess ||
			deliverableTracklineCreateAccess ||
			grantPeriodFindAccess ||
			grantPeriodCreateAccess
		) {
			setValue(
				getTabToShow(
					budgetTargetFindAccess ||
						budgetCategoryCreateAccess ||
						budgetTargetCreateAccess ||
						budgetTargetLineItemCreateAccess,
					impactTargetFindAccess ||
						impactTargetCreateAccess ||
						impactUnitCreateAccess ||
						impactCategoryCreateAccess ||
						impactTracklineCreateAccess,
					deliverableTargetFindAccess ||
						deliverableTargetCreateAccess ||
						deliverableUnitCreateAccess ||
						deliverableCategoryCreateAccess ||
						deliverableTracklineCreateAccess,
					grantPeriodFindAccess || grantPeriodCreateAccess,
					fundReceiptCreateAccess || fundReceiptFindAccess
				)
			);
		}
	}, [
		budgetTargetFindAccess,
		budgetCategoryCreateAccess,
		budgetTargetCreateAccess,
		budgetTargetLineItemCreateAccess,
		impactTargetFindAccess,
		impactTargetCreateAccess,
		impactUnitCreateAccess,
		impactCategoryCreateAccess,
		impactTracklineCreateAccess,
		deliverableTargetFindAccess,
		deliverableTargetCreateAccess,
		deliverableUnitCreateAccess,
		deliverableCategoryCreateAccess,
		deliverableTracklineCreateAccess,
		grantPeriodFindAccess,
		grantPeriodCreateAccess,
		fundReceiptFindAccess,
		fundReceiptCreateAccess,
	]);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Box className={classes.root} boxShadow={0}>
			<Tabs
				value={value}
				indicatorColor="primary"
				textColor="primary"
				onChange={handleChange}
				variant="scrollable"
				scrollButtons="auto"
				aria-label="wrapped label tabs example"
			>
				{tabs.map(
					(tab, index) =>
						tab.tabVisibility && (
							<Tab
								textColor="secondary"
								key={tab.label}
								value={index}
								label={tab.label}
								{...a11yProps(index)}
							/>
						)
				)}
			</Tabs>

			{tabs.map((tab, index) => {
				const createButtons = filterCreateButtonsAccordingToUserAccess(tab.createButtons);

				return (
					<TabContent key={index} value={value} index={index}>
						{tab.tableVisibility && tab.table}
						{createButtons.length > 0 && <AddButton createButtons={createButtons} />}
					</TabContent>
				);
			})}
			{notificationData!.successNotification && (
				<Snackbar severity="success" msg={notificationData!.successNotification} />
			)}
			{notificationData!.errorNotification && (
				<Snackbar severity="error" msg={notificationData!.errorNotification} />
			)}
		</Box>
	);
}
