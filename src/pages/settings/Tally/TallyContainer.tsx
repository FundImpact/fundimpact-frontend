import * as React from "react";
import {
	TableContainer,
	Table,
	TableRow,
	TableCell,
	TableBody,
	TableHead,
	IconButton,
	MenuItem,
	TableFooter,
	TablePagination,
	Collapse,
	Box,
	Typography,
	TableSortLabel,
	Grid,
	Paper,
	Button,
	makeStyles,
	Theme,
	createStyles,
	Menu,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const tableHeading = [
	{ label: "Tally Id" },
	{ label: "Cost Center" },
	{ label: "Donor" },
	{ label: "Project" },
	{ label: "Target" },
	{ label: "Sub-Target" },
	{ label: "Category" },
	{ label: "Status" },
];

const options = ["Modify", "delete"];

const TableData = [
	{
		id: 1,
		name: "ajeet kumar",
		donor: "Donor1",
		project: "project1",
		Target: "Target",
		subTarget: "subTarget",
		category: "Donor 1",
		status: true,
	},
	{
		id: 2,
		name: "ajeet kumar",
		donor: "Donor1",
		project: "project1",
		Target: "Target",
		subTarget: "subTarget",
		category: "Donor 1",
		status: true,
	},
	{
		id: 3,
		name: "ajeet kumar",
		donor: "Donor1",
		project: "project1",
		Target: "Target",
		subTarget: "subTarget",
		category: "Donor 1",
		status: false,
	},
	{
		id: 4,
		name: "ajeet kumar",
		donor: "Donor1",
		project: "project1",
		Target: "Target",
		subTarget: "subTarget",
		category: "Donor 1",
		status: true,
	},
];

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, backgroundColor: theme.palette.background.paper },
		tbody: {
			"& tr:nth-child(4n+1)": { background: theme.palette.action.hover },
			"& tr:nth-child(even)": { background: theme.palette.action.selected },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
			},
		},
	})
);

const styleActive = {
	borderRadius: "50px",
	color: "white",
	padding: "8px",
	background: "#52dd87",
};

const styleInactive = {
	borderRadius: "50px",
	color: "white",
	padding: "8px",
	background: "#bac0bd",
};

function TallyContainer() {
	const tableStyles = styledTable();
	const classes = useStyles();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div style={{ margin: "10px" }}>
			<h1>Vouchers</h1>
			<TableContainer component={Paper}>
				<Table aria-label="simple table" className={classes.table}>
					<TableHead className={tableStyles.th}>
						<TableRow color="primary">
							{tableHeading.map((data) => (
								<TableCell style={{ color: "#5567FF" }}>{data.label}</TableCell>
							))}
							<TableCell>
								<IconButton>
									<MoreVertIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody className={tableStyles.tbody}>
						{TableData.map((data) => (
							<TableRow key={data.id}>
								<TableCell>{data.id}</TableCell>
								<TableCell>{data.name}</TableCell>
								<TableCell>{data.donor}</TableCell>
								<TableCell>{data.project}</TableCell>
								<TableCell>{data.Target}</TableCell>
								<TableCell>{data.subTarget}</TableCell>
								<TableCell>{data.category}</TableCell>
								<TableCell>
									{/* <IconButton
										aria-label="expand row"
										size="small"
										disabled={true}
										className={statusColor}
									> */}
									<span style={data.status ? styleActive : styleInactive}>
										{data.status ? "Active" : "Inactive"}
									</span>
									{/* </IconButton> */}
								</TableCell>
								<TableCell>
									{/* <IconButton>
									<MoreVertIcon />
								</IconButton> */}

									<IconButton
										aria-label="more"
										id="short-button"
										aria-controls="short-menu"
										aria-expanded={open ? "true" : undefined}
										aria-haspopup="true"
										onClick={handleClick}
									>
										<MoreVertIcon />
									</IconButton>
									<Menu
										id="short-menu"
										MenuListProps={{
											"aria-labelledby": "short-button",
										}}
										anchorEl={anchorEl}
										open={open}
										onClose={handleClose}
										PaperProps={{
											style: {
												// maxHeight: ITEM_HEIGHT * 4.5,
												width: "15sch",
											},
										}}
									>
										{options.map((option) => (
											<MenuItem
												key={option}
												selected={option === "Pyxis"}
												onClick={handleClose}
											>
												{option}
											</MenuItem>
										))}
									</Menu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
}

export default TallyContainer;
