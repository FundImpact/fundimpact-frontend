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
} from "@material-ui/core";
import SelectChangeEvent from "@material-ui/core";

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
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	};

	// const [age, setAge] = React.useState("");

	// const changeValue = (event: React.ChangeEvent<{}>, value: string) => {
	// 	const newValue = event.target.value;
	// 	setAge(newValue);
	// };

	return (
		<Box width={"100%"}>
			<Box borderBottom={1} borderColor={"divider"}>
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
			</Box>
			<TabPanel value={value} index={0}>
				country
				{/* <FormControl fullWidth>
					<InputLabel id="demo-simple-select-label">Age</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={age}
						label="Age"
						onChange={changeValue}
					>
						<MenuItem value={10}>Ten</MenuItem>
						<MenuItem value={20}>Twenty</MenuItem>
						<MenuItem value={30}>Thirty</MenuItem>
					</Select>
				</FormControl> */}
			</TabPanel>
			<TabPanel value={value} index={1}>
				State
			</TabPanel>
			<TabPanel value={value} index={2}>
				District
			</TabPanel>
			<TabPanel value={value} index={3}>
				Block
			</TabPanel>
			<TabPanel value={value} index={4}>
				Grampanchayat
			</TabPanel>
			<TabPanel value={value} index={5}>
				Village
			</TabPanel>
		</Box>
	);
}

export default GeoTabs;
