import { useApolloClient, useLazyQuery } from "@apollo/client";
import {
	Box,
	createStyles,
	IconButton,
	makeStyles,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Theme,
	Typography,
} from "@material-ui/core";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { FETCH_GRANT_PERIODS } from "../../../graphql/grantPeriod/query";
import { FORM_ACTIONS } from "../../../models/constants";
import { IGrantPeriod } from "../../../models/grantPeriod/grantPeriodForm";
import { resolveJSON } from "../../../utils/jsonUtils";
import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";
import SimpleMenu from "../../Menu/Menu";
import TableSkeleton from "../../Skeletons/TableSkeleton";

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

interface ISImpleTableProps {
	headers: { label: string; key: string }[];
	data: { [key: string]: string | number }[];
	editGrantPeriod: (value: any) => void;
}

function SimpleTable({ headers, data, editGrantPeriod }: ISImpleTableProps) {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();

	const [anchorEl, setAnchorEl] = React.useState<any>([]);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
		let array = [...anchorEl];
		array[index] = event.currentTarget;
		setAnchorEl(array);
	};
	const closeMenuItems = (index: number) => {
		let array = [...anchorEl];
		array[index] = null;
		setAnchorEl(array);
	};

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell className={tableHeader.th}>#</TableCell>
						{headers.map((header) => (
							<TableCell className={tableHeader.th} key={header.label}>
								{header.label}
							</TableCell>
						))}
						<TableCell>Action</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{data.map((row, index) => (
						<TableRow key={index}>
							<TableCell key={index}> {index + 1} </TableCell>
							{headers.map((header, index) => (
								<TableCell key={header.label}>
									{resolveJSON(row, header.key)}
								</TableCell>
							))}
							<TableCell>
								<IconButton
									aria-controls={`projectmenu${index}`}
									aria-haspopup="true"
									onClick={(e) => {
										handleClick(e, index);
									}}
								>
									<MoreVertOutlinedIcon fontSize="small" />
								</IconButton>
								<SimpleMenu
									handleClose={() => closeMenuItems(index)}
									id={`projectmenu${index}`}
									anchorEl={anchorEl[index]}
								>
									<MenuItem
										onClick={() => {
											console.log(data[index]);
											editGrantPeriod(data[index]);
											// seteditWorkspace(workpsaceToEdit as any);
											closeMenuItems(index);
										}}
									>
										Edit
									</MenuItem>
								</SimpleMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

const headers: ISImpleTableProps["headers"] = [
	{ label: "Name", key: "name" },
	{ label: "Donor", key: "donor.name" },
	{ label: "Start Date", key: "start_date" },
	{ label: "End Date", key: "end_date" },
];

export default function GrantPeriodTable() {
	const apolloClient = useApolloClient();

	let [getProjectGrantPeriods, { loading, data }] = useLazyQuery(FETCH_GRANT_PERIODS, {
		notifyOnNetworkStatusChange: true,
	});
	const dashboardData = useDashBoardData();
	let filter = { project: dashboardData?.project?.id };
	try {
		data = apolloClient.readQuery(
			{
				query: FETCH_GRANT_PERIODS,

				variables: { filter: { project: dashboardData?.project?.id } },
			},
			true
		);
	} catch (error) {}

	useEffect(() => {
		if (!dashboardData?.project?.id) return;
		filter = { ...filter, project: dashboardData?.project?.id };
		console.log(`fecthing new list for project`, dashboardData?.project?.id, { ...filter });
		getProjectGrantPeriods({
			variables: { filter: { project: dashboardData?.project?.id } },
		});
	}, [dashboardData?.project?.id, getProjectGrantPeriods]);

	useEffect(() => {
		if (!data) {
			return;
		}

		console.log(`grantPeriods`, data.grantPeriodsProjectList);
	}, [data]);
	const [grantPeriodToEdit, setGrantPeriodDialog] = useState<IGrantPeriod | null>(null);

	if (loading) return <TableSkeleton />;
	if (!data?.grantPeriodsProjectList?.length) {
		return (
			<Box p={2}>
				<Typography align="center">No Grant Period Created </Typography>
			</Box>
		);
	}

	return (
		<>
			<SimpleTable
				headers={headers}
				data={data?.grantPeriodsProjectList}
				editGrantPeriod={(grantPeriodToEdit) => {
					const newObj: IGrantPeriod = {
						...grantPeriodToEdit,
						donor: grantPeriodToEdit.donor.id,
						project: grantPeriodToEdit.project.id,
					};
					// console.log(`grantPeriodToEdit`, newObj);
					setGrantPeriodDialog(newObj);
				}}
			/>
			<GrantPeriodDialog
				open={!!grantPeriodToEdit}
				onClose={() => setGrantPeriodDialog(null)}
				action={FORM_ACTIONS.UPDATE}
				initialValues={(grantPeriodToEdit as any) as IGrantPeriod}
			/>
		</>
	);

	// return <SimpleTable headers={headers} data={data?.grantPeriodsProjectList} />;
}
