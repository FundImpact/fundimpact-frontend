import { Box, Grid, makeStyles, Tab, Tabs, Theme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { FORM_ACTIONS } from "../../models/constants";
import CommonForm from "../CommonForm";
import { IGeoRegionDropDown } from "../../models/GeoRegions";
import {
	geoCountryInputFields,
	geoStateInputFields,
	geoBlockInputFields,
	geoDistrictInputFields,
	geoGrampanchayatInputFields,
	geoVillageInputFields,
} from "./inputFields.json";
import { useQuery } from "@apollo/client";
import { GET_COUNTRY_DATA } from "../../graphql/Geographies/GeographyCountry";
import { GET_STATE_DATA } from "../../graphql/Geographies/GeographyState";
import { GET_DISTRICT_DATA } from "../../graphql/Geographies/GeographiesDistrict";
import { GET_BLOCK_DATA } from "../../graphql/Geographies/GeographiesBlock";
import { GET_GRAMPANCHAYAT_DATA } from "../../graphql/Geographies/GeographiesGrampanchayat";
import { GET_VILLAGE_DATA } from "../../graphql/Geographies/GeographiesVillage";

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
		flexGrow: 1,
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
	tabs: {
		backgroundColor: theme.palette.primary.main,
		border: theme.palette.common.black,
	},
	tab: {
		color: theme.palette.common.white,
	},
}));

enum tabType {
	countryTab = 0,
	stateTab = 1,
	districtTab = 2,
	blockTab = 3,
	grampanchayatTab = 4,
	villageTab = 5,
}

const getTabToShow = (
	countryTabVisibility: boolean,
	stateTabVisibility: boolean,
	districtTabVisibility: boolean,
	blockTabVisibility: boolean,
	grampanchayatTabVisibility: boolean,
	villageTabVisibility: boolean
) => {
	if (countryTabVisibility) {
		return tabType.countryTab;
	}
	if (stateTabVisibility) {
		return tabType.stateTab;
	}
	if (districtTabVisibility) {
		return tabType.districtTab;
	}
	if (blockTabVisibility) {
		return tabType.blockTab;
	}
	if (grampanchayatTabVisibility) {
		return tabType.grampanchayatTab;
	}
	if (villageTabVisibility) return tabType.villageTab;

	return tabType.countryTab;
};

function GeoRegionsTabsContainer({ formAction, initialValues }: any) {
	const intl = useIntl();

	const { data: countryList } = useQuery(GET_COUNTRY_DATA);
	const { data: stateList } = useQuery(GET_STATE_DATA);
	const { data: districtList } = useQuery(GET_DISTRICT_DATA);
	const { data: blockList } = useQuery(GET_BLOCK_DATA);
	const { data: grampanchayatList } = useQuery(GET_GRAMPANCHAYAT_DATA);
	const { data: villageList } = useQuery(GET_VILLAGE_DATA);

	geoCountryInputFields[0].optionsArray = countryList?.countries;

	geoStateInputFields[0].optionsArray = countryList?.countries;
	geoStateInputFields[1].optionsArray = stateList?.states;

	geoDistrictInputFields[0].optionsArray = countryList?.countries;
	geoDistrictInputFields[1].optionsArray = stateList?.states;
	geoDistrictInputFields[2].optionsArray = districtList?.districts;

	geoBlockInputFields[0].optionsArray = countryList?.countries;
	geoBlockInputFields[1].optionsArray = stateList?.states;
	geoBlockInputFields[2].optionsArray = districtList?.districts;
	geoBlockInputFields[3].optionsArray = blockList?.blocks;

	geoGrampanchayatInputFields[0].optionsArray = countryList?.countries;
	geoGrampanchayatInputFields[1].optionsArray = stateList?.states;
	geoGrampanchayatInputFields[2].optionsArray = districtList?.districts;
	geoGrampanchayatInputFields[3].optionsArray = grampanchayatList?.grampanchayats;

	geoVillageInputFields[0].optionsArray = countryList?.countries;
	geoVillageInputFields[1].optionsArray = stateList?.states;
	geoVillageInputFields[2].optionsArray = districtList?.districts;
	geoVillageInputFields[3].optionsArray = blockList?.blocks;
	geoVillageInputFields[4].optionsArray = villageList?.villages;

	const validate = (values: IGeoRegionDropDown) => {
		let errors: Partial<IGeoRegionDropDown> = {};
		if (!values.name) {
			errors.name = "Name is required";
		}
		return errors;
	};

	const getCountries = (values: any) => {
		console.log("country value", values);
	};

	const updateCountreis = (values: any) => {
		console.log("country value", values);
	};

	const getStates = (values: any) => {
		console.log("states value", values);
	};
	const updateStates = (values: any) => {
		console.log("states value", values);
	};
	const getDistricts = (values: any) => {
		console.log("districts value", values);
	};
	const updateDistricts = (values: any) => {
		console.log("districts value", values);
	};
	const getBlocks = (values: any) => {
		console.log("blocks value", values);
	};
	const updateBlocks = (values: any) => {
		console.log("blocks value", values);
	};
	const getGrampanchayat = (values: any) => {
		console.log("grampanchayat value", values);
	};
	const updateGrampamchayat = (values: any) => {
		console.log("grampanchayat value", values);
	};
	const getVillages = (values: any) => {
		console.log("village value", values);
	};
	const updateVillages = (values: any) => {
		console.log("village value", values);
	};

	const tabs = [
		{
			label: "Country",
			text: intl.formatMessage({
				id: "createCountries",
				defaultMessage: "Countries",
				description: `Create Countries`,
			}),
			form: (
				// <CountryDropDown
				// 	initialValues={{
				// 		country_id: "",
				// 	}}
				// />
				<CommonForm
					initialValues={{ country_id: initialValues?.country_id }}
					validate={validate}
					onCreate={getCountries}
					onUpdate={updateCountreis}
					inputFields={geoCountryInputFields}
					formAction={
						formAction === FORM_ACTIONS.CREATE
							? FORM_ACTIONS.CREATE
							: FORM_ACTIONS.UPDATE
					}
					isCancel={false}
				/>
			),
		},
		{
			label: "State",
			text: intl.formatMessage({
				id: "createStates",
				defaultMessage: "States",
				description: `Create States`,
			}),
			form: (
				// <CountryDropDown
				// 	initialValues={{
				// 		country_id: "",
				// 	}}
				// />
				<CommonForm
					initialValues={{
						country_id: initialValues?.country_id,
						state_id: initialValues?.state_id,
					}}
					validate={validate}
					onCreate={getStates}
					onUpdate={updateStates}
					inputFields={geoStateInputFields}
					formAction={
						formAction === FORM_ACTIONS.CREATE
							? FORM_ACTIONS.CREATE
							: FORM_ACTIONS.UPDATE
					}
					isCancel={false}
				/>
			),
		},

		{
			label: "District",
			text: intl.formatMessage({
				id: "createDistrict",
				defaultMessage: "Districts",
				description: `Create Districts`,
			}),
			form: (
				<CommonForm
					initialValues={{
						country_id: initialValues?.country_id,
						state_id: initialValues?.state_id,
						district_id: initialValues?.district_id,
					}}
					validate={validate}
					onCreate={getDistricts}
					onUpdate={updateDistricts}
					inputFields={geoDistrictInputFields}
					formAction={
						formAction === FORM_ACTIONS.CREATE
							? FORM_ACTIONS.CREATE
							: FORM_ACTIONS.UPDATE
					}
					isCancel={false}
				/>
			),
		},
		{
			label: "Block",
			text: intl.formatMessage({
				id: "createBlocks",
				defaultMessage: "blocks",
				description: `Create blocks`,
			}),
			form: (
				// <CountryDropDown
				// 	initialValues={{
				// 		country_id: "",
				// 	}}
				// />
				<CommonForm
					initialValues={{
						country_id: initialValues?.country_id,
						state_id: initialValues?.state_id,
						district_id: initialValues?.district_id,
						block_id: initialValues?.block_id,
					}}
					validate={validate}
					onCreate={getBlocks}
					onUpdate={updateBlocks}
					inputFields={geoBlockInputFields}
					formAction={
						formAction === FORM_ACTIONS.CREATE
							? FORM_ACTIONS.CREATE
							: FORM_ACTIONS.UPDATE
					}
					isCancel={false}
				/>
			),
		},
		{
			label: "Gram Panchayat",
			text: intl.formatMessage({
				id: "createGrampanchayat",
				defaultMessage: "Grampanchayat",
				description: `Create Grampanchayat`,
			}),
			form: (
				// <CountryDropDown
				// 	initialValues={{
				// 		country_id: "",
				// 	}}
				// />
				<CommonForm
					initialValues={{
						country_id: initialValues?.country_id,
						state_id: initialValues?.state_id,
						district_id: initialValues?.district_id,
						gp_id: initialValues?.gp_id,
					}}
					validate={validate}
					onCreate={getGrampanchayat}
					onUpdate={updateGrampamchayat}
					inputFields={geoGrampanchayatInputFields}
					formAction={
						formAction === FORM_ACTIONS.CREATE
							? FORM_ACTIONS.CREATE
							: FORM_ACTIONS.UPDATE
					}
					isCancel={false}
				/>
			),
		},
		{
			label: "Village",
			text: intl.formatMessage({
				id: "createVillage",
				defaultMessage: "Villages",
				description: `Create Villages`,
			}),
			form: (
				// <CountryDropDown
				// 	initialValues={{
				// 		country_id: "",
				// 	}}
				// />
				<CommonForm
					initialValues={{
						country_id: initialValues?.country_id,
						state_id: initialValues?.state_id,
						district_id: initialValues?.district_id,
						block_id: initialValues?.block_id,
						village_id: initialValues?.village_id,
					}}
					validate={validate}
					onCreate={getVillages}
					onUpdate={updateVillages}
					inputFields={geoVillageInputFields}
					formAction={
						formAction === FORM_ACTIONS.CREATE
							? FORM_ACTIONS.CREATE
							: FORM_ACTIONS.UPDATE
					}
					isCancel={false}
				/>
			),
		},
	];

	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	// let countryCreateAccess: boolean;
	// let stateCreateAccess: boolean;
	// let districtCreateAccess: boolean;
	// let blockCreateAccess: boolean;
	// let grampanchayatCreateAccess: boolean;
	// let villageCreateAccess: boolean;

	// if (value === 0) {
	// 	countryCreateAccess = true;
	// } else if (value === 1) {
	// 	stateCreateAccess = true;
	// } else if (value === 2) {
	// 	districtCreateAccess = true;
	// } else if (value === 3) {
	// 	blockCreateAccess = true;
	// } else if (value === 4) {
	// 	grampanchayatCreateAccess = true;
	// } else if (value === 5) {
	// 	villageCreateAccess = true;
	// }

	// useEffect(() => {
	// 	if (
	// 		countryCreateAccess ||
	// 		stateCreateAccess ||
	// 		districtCreateAccess ||
	// 		blockCreateAccess ||
	// 		grampanchayatCreateAccess ||
	// 		villageCreateAccess
	// 	) {
	// 		setValue(
	// 			getTabToShow(
	// 				countryCreateAccess,
	// 				stateCreateAccess,
	// 				districtCreateAccess,
	// 				blockCreateAccess,
	// 				grampanchayatCreateAccess,
	// 				villageCreateAccess
	// 			)
	// 		);
	// 	}
	// }, []);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Grid container>
			{/* <Box className={classes.root} boxShadow={0} mt={1}> */}
			<Grid xs={12} md={3}>
				<Tabs
					className={classes.tabs}
					value={value}
					indicatorColor="primary"
					textColor="secondary"
					onChange={handleChange}
					orientation="vertical"
					variant="scrollable"
					scrollButtons="auto"
					aria-label="wrapped label tabs example"
				>
					{tabs.map((tab, index) => (
						<Tab
							className={classes.tab}
							key={index}
							value={index}
							label={tab.label}
							{...a11yProps(index)}
						/>
					))}
				</Tabs>
			</Grid>
			<Grid xs={6} md={9}>
				{tabs.map((tab, index) => (
					<TabContent key={index} index={index} value={value}>
						{tab.form}
					</TabContent>
				))}
			</Grid>
			{/* </Box> */}
		</Grid>
	);
}

export default GeoRegionsTabsContainer;
