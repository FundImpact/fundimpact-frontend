import React from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import ImpactCategoryTable from "../../../components/Table/ImpactCategoryTable";
import ImpactUnitTable from "../../../components/Table/ImpactUnitTable";
import { Box, Tabs, Tab, makeStyles, Theme } from "@material-ui/core";
import ImpactUnitDialog from "../../../components/Impact/ImpactUnitDialog/ImpaceUnitDialog";
import ImpactCategoryDialog from "../../../components/Impact/ImpactCategoryDialog";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

function a11yProps(index: any) {
	return {
		id: `wrapped-tab-${index}`,
		"aria-controls": `wrapped-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme: Theme) => ({
	button: {
		margin: theme.spacing(1),
		color: theme.palette.common.white,
	},
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
}));

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

const ImpactMasterView = () => {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	const tabs = [
		{
			label: "Impact Category",
			table: <ImpactCategoryTable />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<ImpactCategoryDialog
						open={open}
						handleClose={handleClose}
						formAction={FORM_ACTIONS.CREATE}
					/>
				),
			},
		},
		{
			label: "Impact Unit",
			table: <ImpactUnitTable />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<ImpactUnitDialog
						open={open}
						handleClose={handleClose}
						formAction={FORM_ACTIONS.CREATE}
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
						description={`This text is the heding of impact ${
							value == 0 ? "Categories" : "Unit"
						} table`}
						defaultMessage={`Impact ${value == 0 ? "Categories" : "Unit"} `}
						id={`impactMasterPageHeading-${value}`}
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
								{...a11yProps(index)}
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

export default ImpactMasterView;
