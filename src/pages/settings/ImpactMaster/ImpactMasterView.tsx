import React from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import ImpactCategoryTable from "../../../components/Table/ImpactCategoryTable";
import ImpactUnitTable from "../../../components/Table/ImpactUnitTable";
import {
	Box,
	Tabs,
	Tab,
	makeStyles,
	Theme,
	Typography,
	Grid,
	Chip,
	Avatar,
} from "@material-ui/core";
import ImpactUnitDialog from "../../../components/Impact/ImpactUnitDialog/ImpaceUnitDialog";
import ImpactCategoryDialog from "../../../components/Impact/ImpactCategoryDialog";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import FilterList from "../../../components/FilterList";
import { impactCategoryInputFields, impactUnitInputFields } from "./inputFields.json"; //make seprate json
import { useDashBoardData } from "../../../contexts/dashboardContext";

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

const ImpactMasterView = ({
	showImpactUnitTable,
	setValue,
	impactCategoryFilterList,
	impactUnitFilterList,
	removeFilteListElements,
	setImpactCategoryFilterList,
	setImpactUnitFilterList,
	impactCategoryFindAccess,
	impactUnitFindAccess,
	impactCategoryCreateAccess,
	impactUnitCreateAccess,
}: {
	showImpactUnitTable: number;
	setValue: React.Dispatch<React.SetStateAction<number>>;
	impactCategoryFilterList: { [key: string]: string };
	impactUnitFilterList: { [key: string]: string };
	removeFilteListElements: (elementToDelete: string) => void;
	setImpactCategoryFilterList: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
	setImpactUnitFilterList: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
	impactCategoryFindAccess: boolean;
	impactUnitFindAccess: boolean;
	impactCategoryCreateAccess: boolean;
	impactUnitCreateAccess: boolean;
}) => {
	const classes = useStyles();
	const dashboardData = useDashBoardData();
	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	const tabs = [
		{
			label: "Impact Category",
			table: <ImpactCategoryTable tableFilterList={impactCategoryFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<ImpactCategoryDialog
						open={open}
						handleClose={handleClose}
						formAction={FORM_ACTIONS.CREATE}
						organization={dashboardData?.organization?.id || ""}
					/>
				),
			},
			addButtonAccess: impactCategoryCreateAccess,
			tabAccess: impactCategoryFindAccess || impactCategoryCreateAccess,
			tableAccess: impactCategoryFindAccess,
		},
		{
			label: "Impact Unit",
			table: <ImpactUnitTable tableFilterList={impactUnitFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<ImpactUnitDialog
						open={open}
						handleClose={handleClose}
						formAction={FORM_ACTIONS.CREATE}
						organization={dashboardData?.organization?.id || ""}
					/>
				),
			},
			addButtonAccess: impactUnitCreateAccess,
			tabAccess: impactUnitFindAccess || impactUnitCreateAccess,
			tableAccess: impactUnitFindAccess,
		},
	];

	const intl = useIntl();

	return (
		<>
			<Box p={2}>
				<Grid container>
					<Grid item xs={11}>
						<Typography variant="h4">
							<Box mt={2} fontWeight="fontWeightBold">
								{(impactCategoryFindAccess ||
									impactUnitFindAccess ||
									impactUnitCreateAccess ||
									impactCategoryCreateAccess) &&
									(showImpactUnitTable == 0 ? (
										<FormattedMessage
											description={`This text is the heding of impact Categories table`}
											defaultMessage={`Impact Categories`}
											id={`impactMasterPageHeading-category`}
										/>
									) : (
										<FormattedMessage
											description={`This text is the heding of impact Unit table`}
											defaultMessage={`Impact Unit`}
											id={`impactMasterPageHeading-unit`}
										/>
									))}
							</Box>
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							{(impactCategoryFindAccess || impactUnitFindAccess) && (
								<FilterList
									setFilterList={
										showImpactUnitTable === 0
											? setImpactCategoryFilterList
											: setImpactUnitFilterList
									}
									inputFields={
										showImpactUnitTable === 0
											? impactCategoryInputFields
											: impactUnitInputFields
									}
								/>
							)}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box my={2} display="flex">
							{(showImpactUnitTable === 0
								? Object.entries(impactCategoryFilterList)
								: Object.entries(impactUnitFilterList)
							).map(
								(filterListObjectKeyValuePair, index) =>
									filterListObjectKeyValuePair[1] && (
										<Box key={index} mx={1}>
											<Chip
												avatar={
													<Avatar
														style={{ height: "30px", width: "30px" }}
													>
														<span>
															{filterListObjectKeyValuePair[0].slice(
																0,
																4
															)}
														</span>
													</Avatar>
												}
												label={filterListObjectKeyValuePair[1]}
												onDelete={() =>
													removeFilteListElements(
														filterListObjectKeyValuePair[0]
													)
												}
											/>
										</Box>
									)
							)}
						</Box>
					</Grid>
				</Grid>

				<Box className={classes.root} boxShadow={0}>
					<Tabs
						value={showImpactUnitTable}
						indicatorColor="primary"
						textColor="primary"
						onChange={handleChange}
						variant="scrollable"
						scrollButtons="auto"
						aria-label="wrapped label tabs example"
					>
						{tabs.map(
							(tab, index) =>
								tab.tabAccess && (
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
								)
						)}
					</Tabs>

					{tabs.map((tab, index) => (
						<TabContent key={index} value={showImpactUnitTable} index={index}>
							{tab.tableAccess && tab.table}
							{tab.addButtonAccess && (
								<AddButton
									createButtons={tab.createButtons}
									buttonAction={tab.buttonAction}
								/>
							)}
						</TabContent>
					))}
				</Box>
			</Box>
		</>
	);
};

export default ImpactMasterView;
