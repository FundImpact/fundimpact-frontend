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
	Grid,
	Avatar,
	Chip,
} from "@material-ui/core";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { FETCH_GRANT_PERIODS } from "../../../graphql/grantPeriod/query";
import { FORM_ACTIONS } from "../../../models/constants";
import { IGrantPeriod } from "../../../models/grantPeriod/grantPeriodForm";
import { resolveJSON } from "../../../utils/jsonUtils";
import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";
import SimpleMenu from "../../Menu/Menu";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import FilterList from "../../FilterList";
import { grantPeriodInputFields } from "./inputFields.json";
import { GET_ORG_DONOR } from "../../../graphql/donor";

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

const chipArr = ({
	arr,
	name,
	removeChips,
}: {
	arr: string[];
	removeChips: (index: number) => void;
	name: string;
}) => {
	return arr.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				onDelete={() => removeChips(index)}
			/>
		</Box>
	));
};

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
										<FormattedMessage
											id="editMenu"
											defaultMessage="Edit"
											description="This text will be show on menus for EDIT"
										/>
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

let donorHash: { [key: string]: string } = {};

const mapIdToName = (arr: { id: string; name: string }[], obj: { [key: string]: string }) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		obj
	);
};

export default function GrantPeriodTable() {
	const apolloClient = useApolloClient();
	const [queryFilter, setQueryFilter] = useState({});
	let [getProjectGrantPeriods, { loading, data }] = useLazyQuery(FETCH_GRANT_PERIODS, {
		notifyOnNetworkStatusChange: true,
	});

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onCompleted: (data) => {
			donorHash = mapIdToName(data.orgDonors, donorHash);
		},
	});

	const dashboardData = useDashBoardData();
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>({
		name: "",
		start_date: "",
		end_date: "",
		donor: [],
	});

	useEffect(() => {
		setQueryFilter({
			project: dashboardData?.project?.id,
		});
	}, [dashboardData]);

	const removeFilterListElements = (key: string, index?: number) => {
		setFilterList((obj) => {
			if (Array.isArray(obj[key])) {
				obj[key] = (obj[key] as string[]).filter((ele, i) => index != i);
			} else {
				obj[key] = "";
			}
			return { ...obj };
		});
	};

	useEffect(() => {
		if (filterList) {
			let obj: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					obj[key] = filterList[key];
					if (key == "start_date") {
						obj[key] = `${new Date(filterList[key] as string)}`;
					}
					if (key == "end_date") {
						obj[key] = `${new Date(filterList[key] as string)}`;
					}
				}
			}
			setQueryFilter({
				project: dashboardData?.project?.id,
				...obj,
			});
		}
	}, [filterList]);
	console.log("queryFilter :>> ", queryFilter);
	let filter = { project: dashboardData?.project?.id };
	try {
		data = apolloClient.readQuery(
			{
				query: FETCH_GRANT_PERIODS,

				variables: { filter: queryFilter },
			},
			true
		);
	} catch (error) {}

	useEffect(() => {
		if (!dashboardData?.project?.id) return;
		filter = { ...filter, project: dashboardData?.project?.id };
		console.log(`fecthing new list for project`, dashboardData?.project?.id, { ...filter });
		getProjectGrantPeriods({
			variables: { filter: queryFilter },
		});
	}, [dashboardData?.project?.id, getProjectGrantPeriods, queryFilter]);

	useEffect(() => {
		if (!data) {
			return;
		}

		console.log(`grantPeriods`, data.grantPeriodsProjectList);
	}, [data]);
	const [grantPeriodToEdit, setGrantPeriodDialog] = useState<IGrantPeriod | null>(null);

	useEffect(() => {
		if (dashboardData?.organization) {
			getOrganizationDonors({
				variables: {
					filter: {
						organization: dashboardData?.organization?.id,
					},
				},
			});
		}
	}, [dashboardData]);

	grantPeriodInputFields[3].optionsArray = donors?.orgDonors || [];

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
			<Grid container>
				<Grid item xs={11}>
					<Box my={2} display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((element) => {
							if (element[1] && typeof element[1] == "string") {
								return chipArr({
									name: element[0].slice(0, 5),
									arr: [element[1]],
									removeChips: (index: number) => {
										removeFilterListElements(element[0]);
									},
								});
							}
							if (element[1] && Array.isArray(element[1])) {
								if (element[0] == "donor") {
									return chipArr({
										name: "do",
										arr: element[1].map((ele) => donorHash[ele]),
										removeChips: (index: number) => {
											removeFilterListElements(element[0], index);
										},
									});
								}
							}
						})}
					</Box>
				</Grid>
				<Grid item xs={1}>
					<Box mt={2}>
						<FilterList
							initialValues={{
								name: "",
								start_date: "",
								end_date: "",
								donor: [],
							}}
							setFilterList={setFilterList}
							inputFields={grantPeriodInputFields}
						/>
					</Box>
				</Grid>
			</Grid>
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
