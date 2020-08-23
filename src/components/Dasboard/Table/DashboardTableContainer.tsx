import { Box, makeStyles, Tab, Tabs, Theme, Typography } from "@material-ui/core";
import React from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";

import CreateBudgetDialog from "../../Budget/CreateBudgetDialog";
import CreateBudgetTargetDialog from "../../Budget/CreateBudgetTargetDialog";
import BudgetTargetTable from "../../Table/BudgetTargetTable";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import ImpactUnitDialog from "../../Impact/ImpactUnitDialog";
import CreateBudgetLineitemDialog from "../../Budget/CreateBudgetLineitemDialog";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import { useNotificationData } from "../../../contexts/notificationContext";

import AddButton from "../../Dasboard/AddButton";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import Deliverable from "../../Deliverable/Deliverable";
import DeliverableTarget from "../../Deliverable/DeliverableTarget";
import DeliverableTargetLine from "../../Deliverable/DeliverableTargetLine";
import DeliverableUnit from "../../Deliverable/DeliverableUnit";
import { IMPACT_ACTIONS } from "../../Impact/constants";
import ImpactTarget from "../../Impact/impactTarget";
import Snackbar from "../../Snackbar/Snackbar";
import DeliverablesTable from "../../Table/Deliverable";
import ImpactsTable from "../../Table/Impacts";

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
	const dashboardData = useDashBoardData();
	const tabs = [
		{
			label: "Budget",
			table: <BudgetTargetTable />,
			createButtons: [
				{
					text: "Create Budget Category",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<CreateBudgetDialog open={open} handleClose={handleClose} />
					),
				},
				{ text: "Create Deliverables" },
				{ text: "Create Impact Indicators" },
				{ text: "Add Donor" },
				{ text: "Create Budget Indicators" },
				{ text: "Track Budget Spend" },
				{ text: "Report Fund Receipt" },
				{
					text: "Create Budget Target",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<CreateBudgetTargetDialog
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
				},
				{
					text: "Create Budget Tracking Lineitem",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<CreateBudgetLineitemDialog
							formAction={FORM_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
						/>
					),
				},
			],
		},
		{
			label: "Deliverables",
			table: <DeliverablesTable />,
			createButtons: [
				{
					text: "Create Deliverables Category",
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
					text: "Create Deliverable Targets",
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
					text: "Create Deliverable Unit",
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
					text: "Report Achivement",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<DeliverableTargetLine
							type={DELIVERABLE_ACTIONS.CREATE}
							open={open}
							handleClose={handleClose}
							deliverableTarget={dashboardData?.project?.id}
						/>
					),
				},
			],
		},
		{
			label: "Impact Indicators",
			table: <ImpactsTable />,
			createButtons: [
				{
					text: "Create Impact Targets",
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
					text: "Create Impact Unit",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<ImpactUnitDialog open={open} handleClose={handleClose} />
					),
				},
				{
					text: "Create Impact Category",
					dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
						<ImpactCategoryDialog open={open} handleClose={handleClose} />
					),
				},
				{ text: "Report Achivement" },
			],
		},
		{ label: "Documents", createButtons: [] },
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
					<Box className={classes.contentHeading}>
						<Typography variant="subtitle2">Budget Tracker</Typography>
					</Box>
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
