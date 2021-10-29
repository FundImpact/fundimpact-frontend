import React from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import GeographiesStateTable from "../../../components/Table/GeographiesStateTable";
import GeographiesGrampanchayatTable from "../../../components/Table/GeographiesGrampanchayatTable";
import GeographiesDistrictTable from "../../../components/Table/GeographiesDistrictTable";
import GeographiesBlockTable from "../../../components/Table/GeographiesBlockTable";
import GeographiesVillageTable from "../../../components/Table/GeographiesVillageTable";
import GeographiesCountryTable from "../../../components/Table/GeographiesCountryTable";
import { Box, Tabs, Tab, Theme, Grid, Typography, Chip, Avatar } from "@material-ui/core";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { makeStyles } from "@material-ui/styles";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";
import FilterList from "../../../components/FilterList";
import { deliverableCategoryInputFields, deliverableUnitInputFields } from "./inputFields.json"; //make seprate json
import Geographies from "../../../components/Geographies/Geographies";
import { GEOGRAPHIES_ACTIONS } from "../../../components/Geographies/constants";
import GeographiesState from "../../../components/Geographies/GeographiesState";
import GeographiesDistrict from "../../../components/Geographies/GeographiesDistrict";
import GeographiesBlock from "../../../components/Geographies/GeographiesBlock";
import GeographiesVillage from "../../../components/Geographies/GeographiesVillage";
import GeographiesGrampanchayat from "../../../components/Geographies/GeographiesGrampanchayat";

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

const GeographiesMasterView = ({
	value,
	setValue,
	geographiesCountryFilterList,
	deliverableUnitFilterList,
	removeFilteListElements,
	setGeographiesCountryFilterList,
	setDeliverableUnitFilterList,
	deliverableCategoryFindAccess,
	deliverableUnitFindAccess,
	geographiesCountryCreateAccess,
	deliverableUnitCreateAccess,
}: {
	value: number;
	setValue: React.Dispatch<React.SetStateAction<number>>;
	geographiesCountryFilterList: { [key: string]: string };
	deliverableUnitFilterList: { [key: string]: string };
	removeFilteListElements: (elementToDelete: string) => void;
	setGeographiesCountryFilterList: React.Dispatch<
		React.SetStateAction<{ [key: string]: string }>
	>;
	setDeliverableUnitFilterList: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
	deliverableCategoryFindAccess: boolean;
	deliverableUnitFindAccess: boolean;
	geographiesCountryCreateAccess: boolean;
	deliverableUnitCreateAccess: boolean;
}) => {
	const dashboardData = useDashBoardData();
	const classes = useStyles();

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	const tabs = [
		{
			label: "Country",
			table: <GeographiesCountryTable tableFilterList={geographiesCountryFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<Geographies
						type={GEOGRAPHIES_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
			addButtonAccess: geographiesCountryCreateAccess,
			tableAccess: deliverableCategoryFindAccess,
			tabAccess: deliverableCategoryFindAccess || geographiesCountryCreateAccess,
		},
		{
			label: "State",
			table: <GeographiesStateTable tableFilterList={deliverableUnitFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<GeographiesState
						type={GEOGRAPHIES_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
			addButtonAccess: deliverableUnitCreateAccess,
			tableAccess: deliverableUnitFindAccess,
			tabAccess: deliverableUnitFindAccess || deliverableUnitCreateAccess,
		},
		{
			label: "District",
			table: <GeographiesDistrictTable tableFilterList={deliverableUnitFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<GeographiesDistrict
						type={GEOGRAPHIES_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
			addButtonAccess: deliverableUnitCreateAccess,
			tableAccess: deliverableUnitFindAccess,
			tabAccess: deliverableUnitFindAccess || deliverableUnitCreateAccess,
		},
		{
			label: "Block",
			table: <GeographiesBlockTable tableFilterList={deliverableUnitFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<GeographiesBlock
						type={GEOGRAPHIES_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
			addButtonAccess: deliverableUnitCreateAccess,
			tableAccess: deliverableUnitFindAccess,
			tabAccess: deliverableUnitFindAccess || deliverableUnitCreateAccess,
		},
		{
			label: "Gram Panchayat",
			table: <GeographiesGrampanchayatTable tableFilterList={deliverableUnitFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<GeographiesGrampanchayat
						type={GEOGRAPHIES_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
			addButtonAccess: deliverableUnitCreateAccess,
			tableAccess: deliverableUnitFindAccess,
			tabAccess: deliverableUnitFindAccess || deliverableUnitCreateAccess,
		},
		{
			label: "Village",
			table: <GeographiesVillageTable tableFilterList={deliverableUnitFilterList} />,
			createButtons: [],
			buttonAction: {
				dialog: ({ open, handleClose }: { open: boolean; handleClose: () => void }) => (
					<GeographiesVillage
						type={GEOGRAPHIES_ACTIONS.CREATE}
						open={open}
						handleClose={handleClose}
						organization={dashboardData?.organization?.id}
					/>
				),
			},
			addButtonAccess: deliverableUnitCreateAccess,
			tableAccess: deliverableUnitFindAccess,
			tabAccess: deliverableUnitFindAccess || deliverableUnitCreateAccess,
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
								{(deliverableCategoryFindAccess ||
									deliverableUnitFindAccess ||
									deliverableUnitCreateAccess ||
									geographiesCountryCreateAccess) &&
									(value == 0 ? (
										<FormattedMessage
											description={`This text is the heding of deliverable Categories table`}
											defaultMessage={`Geographies`}
											id={`deliverableMasterPageHeading-category`}
										/>
									) : (
										<FormattedMessage
											description={`This text is the heding of deliverable Unit table`}
											defaultMessage={`Geographies`}
											id={`deliverableMasterPageHeading-unit`}
										/>
									))}
							</Box>
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							{(deliverableCategoryFindAccess || deliverableUnitFindAccess) && (
								<FilterList
									setFilterList={
										value === 0
											? setGeographiesCountryFilterList
											: setDeliverableUnitFilterList
									}
									inputFields={
										value === 0
											? deliverableCategoryInputFields
											: deliverableUnitInputFields
									}
								/>
							)}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box my={2} display="flex">
							{(value === 0
								? Object.entries(geographiesCountryFilterList)
								: Object.entries(deliverableUnitFilterList)
							).map(
								(filterListObjectKeyValuePair, index) =>
									filterListObjectKeyValuePair[1] && (
										<Box key={index} mx={1}>
											<Chip
												label={filterListObjectKeyValuePair[1]}
												avatar={
													<Avatar
														style={{ width: "30px", height: "30px" }}
													>
														<span>
															{filterListObjectKeyValuePair[0].slice(
																0,
																4
															)}
														</span>
													</Avatar>
												}
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
						aria-label="wrapped label tabs example"
						textColor="primary"
						onChange={handleChange}
						variant="scrollable"
						indicatorColor="primary"
						scrollButtons="auto"
						value={value}
					>
						{tabs.map(
							(tab, index) =>
								tab.tabAccess && (
									<Tab
										value={index}
										key={tab.label}
										textColor="secondary"
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
								)
						)}
					</Tabs>
					{/* table data*/}
					{tabs.map((tab, index) => (
						<TabContent key={index} value={value} index={index}>
							{tab.tableAccess && tab.table}
							{/* create button */}
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

export default GeographiesMasterView;
