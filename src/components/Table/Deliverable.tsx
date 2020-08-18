import { IconButton, Menu, MenuItem, Table } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useEffect, useState } from "react";
import { GET_DELIVERABLE_TARGET_BY_PROJECT } from "../../graphql/queries/Deliverable/target";
import { useLazyQuery } from "@apollo/client";
import { useDashBoardData } from "../../contexts/dashboardContext";
const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const StyledTableHeader = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main },
		tbody: {
			"& tr:nth-child(even) td": { background: "#F5F6FA" },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
			},
		},
	})
);

function createRow(col1: string, col2: string, col3: string, col4: string) {
	return { col1, col2, col3, col4 };
}

const tableHeading = [
	{ label: "S.no" },
	{ label: "Name" },
	{ label: "Category" },
	{ label: "Target Value" },
	{ label: "Unit" },
	{ label: "" }, //edit icon
];

export default function DeliverablesTable() {
	// let tt: TableCellProps;
	// tt.
	const dashboardData = useDashBoardData();
	const [getDeliverableTargetByProject, { loading, data }] = useLazyQuery(
		GET_DELIVERABLE_TARGET_BY_PROJECT
	);
	useEffect(() => {
		if (dashboardData?.project) {
			console.log("project", dashboardData?.project);
			getDeliverableTargetByProject({
				variables: { filter: { project: dashboardData?.project.id } },
			});
		}
	}, [dashboardData, dashboardData?.project]);

	const [rows, setRows] = useState<any>([]);
	useEffect(() => {
		console.log("data", data);
		if (data && data.deliverableTargetList && data.deliverableTargetList.length) {
			let deliverableTargetList = data.deliverableTargetList;
			let arr = [];
			for (let i = 0; i < deliverableTargetList.length; i++) {
				if (deliverableTargetList[i].deliverable_category_unit) {
					let row = createRow(
						deliverableTargetList[i].name,
						deliverableTargetList[i].deliverable_category_unit.deliverable_category_org
							.name,
						deliverableTargetList[i].target_value,

						deliverableTargetList[i].deliverable_category_unit.deliverable_units_org
							.name
					);
					arr.push(row);
				}
			}
			setRows(arr);
		}
	}, [data]);
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	console.log(`table header`, tableHeader);

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{tableHeading.map((heading) => (
							<TableCell className={tableHeader.th} key={heading.label} align="left">
								{heading.label}
							</TableCell>
						))}
						{/* <TableCell>Dessert (100g serving)</TableCell>
						<TableCell align="left">col2</TableCell>
						<TableCell align="left">col3&nbsp;(g)</TableCell>
						<TableCell align="left">col4&nbsp;(g)</TableCell>
						<TableCell align="left">col5&nbsp;(g)</TableCell> */}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{rows.map((row: any, index: number) => (
						<TableRow key={index}>
							<TableCell component="td" scope="row">
								{index + 1}
							</TableCell>
							<TableCell align="left">{row.col1}</TableCell>
							<TableCell align="left">{row.col2}</TableCell>
							<TableCell align="left">{row.col3}</TableCell>
							<TableCell align="left">{row.col4}</TableCell>
							<TableCell>
								<IconButton aria-label="delete">
									<MoreVertIcon fontSize="small" />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
