import * as React from "react";
import {
	Box,
	Tabs,
	Tab,
	Typography,
	Dialog,
	InputLabel,
	Select,
	FormControl,
	MenuItem,
	Grid,
	Divider,
} from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { GET_COUNTRY_DATA } from "../../graphql/Geographies/GeographyCountry";
import { GET_STATE_DATA } from "../../graphql/Geographies/GeographyState";
import { GET_BLOCK_DATA } from "../../graphql/Geographies/GeographiesBlock";
import { GET_DISTRICT_DATA } from "../../graphql/Geographies/GeographiesDistrict";
import { GET_GRAMPANCHAYAT_DATA } from "../../graphql/Geographies/GeographiesGrampanchayat";
import { GET_VILLAGE_DATA } from "../../graphql/Geographies/GeographiesVillage";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={1}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function GeoTabs() {
	const [age, setAge] = React.useState("");
	const [value, setValue] = React.useState(0);

	const { data: countries } = useQuery(GET_COUNTRY_DATA);
	const { data: states } = useQuery(GET_STATE_DATA);
	const { data: districts } = useQuery(GET_DISTRICT_DATA);
	const { data: blocks } = useQuery(GET_BLOCK_DATA);
	const { data: grampanchayats } = useQuery(GET_GRAMPANCHAYAT_DATA);
	const { data: villages } = useQuery(GET_VILLAGE_DATA);

	console.log("countries", villages?.villages);

	let countryDropDown: any = (
		<FormControl fullWidth>
			<InputLabel id="country-select-label">Country</InputLabel>
			<Select
				labelId="country-select-label"
				id="country-simple-select"
				value={age}
				label="Country"
				// onChange={selectChange}
			>
				{countries?.countries.map((country: any) => (
					<MenuItem value={country.id}>{country.name}</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	let StateDropDown: any = (
		<FormControl fullWidth>
			<InputLabel id="state-select-label">State</InputLabel>
			<Select
				labelId="state-select-label"
				id="state-simple-select"
				value={age}
				label="State"
				// onChange={selectChange}
			>
				{states?.states.map((state: any) => (
					<MenuItem value={state.id}>{state.name}</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	let DistrictDropDown: any = (
		<FormControl fullWidth>
			<InputLabel id="district-select-label">District</InputLabel>
			<Select
				labelId="district-select-label"
				id="district-simple-select"
				value={age}
				label="District"
				// onChange={selectChange}
			>
				{districts?.districts.map((district: any) => (
					<MenuItem value={district.id}>{district.name}</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	let BlockDropDown: any = (
		<FormControl fullWidth>
			<InputLabel id="block-select-label">Block</InputLabel>
			<Select
				labelId="block-select-label"
				id="block-simple-select"
				value={age}
				label="Block"
				// onChange={selectChange}
			>
				{blocks?.blocks.map((block: any) => (
					<MenuItem value={block.id}>{block.name}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
	let GramPanchayatDropDown: any = (
		<FormControl fullWidth>
			<InputLabel id="grampanchayat-select-label">Gram Panchayat</InputLabel>
			<Select
				labelId="grampanchayat-select-label"
				id="grampanchayat-simple-select"
				value={age}
				label="Grampanchayat"
				// onChange={selectChange}
			>
				{grampanchayats?.grampanchayats.map((grampanchayat: any) => (
					<MenuItem value={grampanchayat.id}>{grampanchayat.name}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
	let VillageDropDown: any = (
		<FormControl fullWidth>
			<InputLabel id="village-select-label">Village</InputLabel>
			<Select
				labelId="village-select-label"
				id="village-simple-select"
				value={age}
				label="Village"
				// onChange={selectChange}
			>
				{villages?.villages.map((village: any) => (
					<MenuItem value={village.id}>{village.name}</MenuItem>
				))}
			</Select>
		</FormControl>
	);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
		switch (newValue) {
			case 0:
				return countryDropDown;
			case 1:
				return StateDropDown;
			case 2:
				return DistrictDropDown;
			case 3:
				return BlockDropDown;
			case 4:
				return GramPanchayatDropDown;
			case 5:
				return VillageDropDown;
		}
	};

	// const selectChange = (event: React.ChangeEvent<{}>) => {
	// 	const newValue = event.currentTarget.value;
	// 	setAge(newValue);
	// 	// setAge(event.currentTarget.value as string);
	// };

	return (
		<Box width={"100%"}>
			<Grid container spacing={2}>
				<Grid xs={6} md={4}>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="basic tabs example"
						orientation="vertical"
						variant="scrollable"
					>
						<Tab label="country" {...a11yProps(0)} />
						<Tab label="State" {...a11yProps(1)} />
						<Tab label="District" {...a11yProps(2)} />
						<Tab label="Block" {...a11yProps(3)} />
						<Tab label="Grampanchayat" {...a11yProps(4)} />
						<Tab label="Village" {...a11yProps(5)} />
					</Tabs>
				</Grid>

				<Grid xs={6} md={8}>
					<TabPanel value={value} index={0}>
						{countryDropDown}
					</TabPanel>
					<TabPanel value={value} index={1}>
						{StateDropDown}
					</TabPanel>
					<TabPanel value={value} index={2}>
						{DistrictDropDown}
					</TabPanel>
					<TabPanel value={value} index={3}>
						{BlockDropDown}
					</TabPanel>
					<TabPanel value={value} index={4}>
						{GramPanchayatDropDown}
					</TabPanel>
					<TabPanel value={value} index={5}>
						{VillageDropDown}
					</TabPanel>
				</Grid>
			</Grid>
		</Box>
	);
}

export default GeoTabs;
