import { Box, makeStyles, Tab, Tabs, Theme } from "@material-ui/core";
import React from "react";

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

export default function DashboardTableContainer() {
	const intl = useIntl();
	const dashboardData = useDashBoardData();
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
				},
			],
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
				},
			],
		},
		{
			label: intl.formatMessage({
				id: "impactTabHeading",
				defaultMessage: "Impact Indicator",
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
				},
			],
		},
		{
			label: intl.formatMessage({
				id: "grantPeriodTabHeading",
				defaultMessage: "Grant Period",
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
				},
			],
		},
	];
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const notificationData = useNotificationData();

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		console.log(`setting tab index `, newValue);
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
				{tabs.map((tab, index) => (
					<Tab
						textColor="secondary"
						key={tab.label}
						value={index}
						label={tab.label}
						{...a11yProps(index)}
					/>
				))}
			</Tabs>

			{tabs.map((tab, index) => (
				<TabContent key={index} value={value} index={index}>
					{/* <Box className={classes.contentHeading}>
						<Typography variant="subtitle2">Budget Tracker</Typography>
					</Box> */}
					{tab.table}
					{/* {GetTable(tab.label)} */}
					<AddButton createButtons={tab.createButtons} />
				</TabContent>
			))}
			{notificationData!.successNotification && (
				<Snackbar severity="success" msg={notificationData!.successNotification} />
			)}
			{notificationData!.errorNotification && (
				<Snackbar severity="error" msg={notificationData!.errorNotification} />
			)}
		</Box>
	);
}
