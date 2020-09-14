import React from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import DeliverableCategoryTable from "../../../components/Table/DeliverableCategoryTable";
import DeliverableUnitTable from "../../../components/Table/DeliverableUnitTable";
import { Box, Tabs, Tab, Theme } from "@material-ui/core";
import DeliverableUnit from "../../../components/Deliverable/DeliverableUnit";
import Deliverable from "../../../components/Deliverable/Deliverable";
import { DELIVERABLE_ACTIONS } from "../../../components/Deliverable/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { makeStyles } from "@material-ui/styles";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

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
			{value === index && <Box p={2}>{children}</Box>}
		</div>
	);
}

function a11yProp(index: any) {
	return {
		id: `wrapped-tab-${index}`,
		"aria-controls": `wrapped-tabpanel-${index}`,
	};
}

const DeliverableMasterView = () => {
	const dashboardData = useDashBoardData();
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	const tabs = [
		{
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<Deliverable
						type={DELIVERABLE_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
			createButtons: [],
			table: <DeliverableCategoryTable />,
			label: "Deliverable Category",
		},
		{
			label: "Deliverable Unit",
			table: <DeliverableUnitTable />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<DeliverableUnit
						type={DELIVERABLE_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
		},
	];

	const intl = useIntl();

	return (
		<>
			<Box p={2}>
				<h1>
					<FormattedMessage
						id={`deliverableMasterPageHeading-${value}`}
						defaultMessage={`Deliverable ${value == 0 ? "Categories" : "Unit"} `}
						description={`This text is the heding of deliverable ${
							value == 0 ? "Categories" : "Unit"
						} table`}
					/>
				</h1>

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
								label={intl.formatMessage({
									id: `${tab.label
										.toString()
										.replace(/ /g, "")
										.toLowerCase()}TabHeading`,
									defaultMessage: tab.label,
									description: `This text will be shown for ${tab.label} table heading`,
								})}
								{...a11yProp(index)}
							/>
						))}
					</Tabs>

					{tabs.map((tab, index) => (
						<TabContent key={index} value={value} index={index}>
							{tab.table}
							<AddButton
								createButtons={tab.createButtons}
								buttonAction={tab.buttonAction}
							/>
						</TabContent>
					))}
				</Box>
			</Box>
		</>
	);
};

export default DeliverableMasterView;
