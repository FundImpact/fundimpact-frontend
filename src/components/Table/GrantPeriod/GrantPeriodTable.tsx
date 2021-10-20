import {
	ApolloQueryResult,
	OperationVariables,
	useApolloClient,
	useLazyQuery,
} from "@apollo/client";
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
	useTheme,
	Button,
} from "@material-ui/core";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { useDashBoardData } from "../../../contexts/dashboardContext";
import { FETCH_GRANT_PERIODS } from "../../../graphql/grantPeriod/query";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { IGrantPeriod } from "../../../models/grantPeriod/grantPeriodForm";
import { resolveJSON } from "../../../utils/jsonUtils";
import GrantPeriodDialog from "../../GrantPeriod/GrantPeriod";
import SimpleMenu from "../../Menu/Menu";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import FilterList from "../../FilterList";
import { grantPeriodInputFields } from "./inputFields.json";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { removeFilterListObjectElements } from "../../../utils/filterList";
import { MODULE_CODES, userHasAccess } from "../../../utils/access";
import { GRANT_PERIOD_ACTIONS } from "../../../utils/access/modules/grantPeriod/actions";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	DONOR_EXPORT,
	GRANT_PERIOD_TABLE_EXPORT,
	GRANT_PERIOD_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import { useAuth } from "../../../contexts/userContext";
import { exportTable } from "../../../utils/importExportTable.utils";
// import DeleteModal from "../../DeleteModal";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});
const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main },
		tbody: {
			"& tr:nth-child(even) td": { background: theme.palette.action.hover },
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
	children: React.ReactNode;
	deleteGrantPeriod: React.Dispatch<React.SetStateAction<boolean>>;
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

function SimpleTable({
	headers,
	data,
	editGrantPeriod,
	children,
	deleteGrantPeriod,
}: ISImpleTableProps) {
	const classes = useStyles();
	const tableStyles = styledTable();

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

	const grantPeriodEditAccess = userHasAccess(
		MODULE_CODES.GRANT_PERIOD,
		GRANT_PERIOD_ACTIONS.UPDATE_GRANT_PERIOD
	);

	const grantPeriodDeleteAccess = userHasAccess(
		MODULE_CODES.GRANT_PERIOD,
		GRANT_PERIOD_ACTIONS.DELETE_GRANT_PERIOD
	);

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell className={tableStyles.th}>#</TableCell>
						{headers.map((header) => (
							<TableCell className={tableStyles.th} key={header.label}>
								{header.label}
							</TableCell>
						))}
						<TableCell>{children}</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className={tableStyles.tbody}>
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
									style={{
										visibility:
											grantPeriodEditAccess || grantPeriodDeleteAccess
												? "visible"
												: "hidden",
									}}
								>
									<MoreVertOutlinedIcon fontSize="small" />
								</IconButton>
								<SimpleMenu
									handleClose={() => closeMenuItems(index)}
									id={`projectmenu${index}`}
									anchorEl={anchorEl[index]}
								>
									{grantPeriodEditAccess && (
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
									)}
									{grantPeriodDeleteAccess && (
										<MenuItem
											onClick={() => {
												editGrantPeriod(data[index]);
												closeMenuItems(index);
												deleteGrantPeriod(true);
											}}
										>
											<FormattedMessage
												id="deleteGrantPeriod"
												defaultMessage="Delete"
												description="This text will be show on menus for DELETE"
											/>
										</MenuItem>
									)}
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

const mapIdToName = (
	arr: { id: string; name: string }[],
	initialObject: { [key: string]: string }
) => {
	return arr.reduce(
		(accumulator: { [key: string]: string }, current: { id: string; name: string }) => {
			accumulator[current.id] = current.name;
			return accumulator;
		},
		initialObject
	);
};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArr({
			name: filterListObjectKeyValuePair[0].slice(0, 5),
			arr: [filterListObjectKeyValuePair[1]],
			removeChips: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "donor") {
			return chipArr({
				name: "do",
				arr: filterListObjectKeyValuePair[1].map((ele) => donorHash[ele]),
				removeChips: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
};

const ImportExportTableMenuHoc = ({
	importButtonOnly,
	refetchGrantPeriods,
}: {
	importButtonOnly?: boolean;
	refetchGrantPeriods:
		| ((variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>)
		| undefined;
}) => {
	const dashboardData = useDashBoardData();
	const theme = useTheme();
	const { jwt } = useAuth();

	const grantPeriodImportFromCsvAccess = userHasAccess(
		MODULE_CODES.GRANT_PERIOD,
		GRANT_PERIOD_ACTIONS.GRANT_PERIOD_IMPORT_FROM_CSV
	);

	const grantPeriodExportAccess = userHasAccess(
		MODULE_CODES.GRANT_PERIOD,
		GRANT_PERIOD_ACTIONS.GRANT_PERIOD_EXPORT
	);
	return (
		<ImportExportTableMenu
			tableName="Grant Period"
			tableExportUrl={`${GRANT_PERIOD_TABLE_EXPORT}/${dashboardData?.project?.id}`}
			tableImportUrl={`${GRANT_PERIOD_TABLE_IMPORT}/${dashboardData?.project?.id}`}
			onImportTableSuccess={() => refetchGrantPeriods?.()}
			importButtonOnly={importButtonOnly}
			hideExport={!grantPeriodExportAccess}
			hideImport={!grantPeriodImportFromCsvAccess}
		>
			<>
				<Button
					variant="outlined"
					style={{ marginRight: theme.spacing(1) }}
					onClick={() =>
						exportTable({
							tableName: "Donors",
							jwt: jwt as string,
							tableExportUrl: `${DONOR_EXPORT}/${dashboardData?.project?.id}`,
						})
					}
				>
					Donor Export
				</Button>
				<Button
					variant="outlined"
					style={{ marginRight: theme.spacing(1), float: "right" }}
					onClick={() =>
						exportTable({
							tableName: "Grant Period Template",
							jwt: jwt as string,
							tableExportUrl: `${GRANT_PERIOD_TABLE_EXPORT}/${dashboardData?.project?.id}?header=true`,
						})
					}
				>
					Grant Period Template
				</Button>
			</>
		</ImportExportTableMenu>
	);
};

const getDefaultFilterList = () => ({
	name: "",
	start_date: "",
	end_date: "",
	donor: [],
});

export default function GrantPeriodTable() {
	const apolloClient = useApolloClient();
	const [deleteGrantPeriod, setDeleteGrantPeriod] = useState<boolean>(false);
	const [queryFilter, setQueryFilter] = useState({});
	let [getProjectGrantPeriods, { loading, data, refetch: refetchGrantPeriods }] = useLazyQuery(
		FETCH_GRANT_PERIODS,
		{
			notifyOnNetworkStatusChange: true,
		}
	);

	const [getOrganizationDonors, { data: donors }] = useLazyQuery(GET_ORG_DONOR, {
		onCompleted: (data) => {
			donorHash = mapIdToName(data.orgDonors, donorHash);
		},
	});

	const dashboardData = useDashBoardData();
	const [filterList, setFilterList] = useState<{
		[key: string]: string | string[];
	}>(getDefaultFilterList());

	useEffect(() => {
		setQueryFilter({
			project: dashboardData?.project?.id,
		});
		setFilterList(getDefaultFilterList());
	}, [dashboardData, setFilterList, setQueryFilter]);

	const removeFilterListElements = (key: string, index?: number) => {
		setFilterList((filterListObject) =>
			removeFilterListObjectElements({ filterListObject, key, index })
		);
	};

	useEffect(() => {
		if (filterList) {
			let newFilterListObject: { [key: string]: string | string[] } = {};
			for (let key in filterList) {
				if (filterList[key] && filterList[key].length) {
					newFilterListObject[key] = filterList[key];
					if (key === "start_date") {
						newFilterListObject[key] = `${new Date(filterList[key] as string)}`;
					}
					if (key === "end_date") {
						newFilterListObject[key] = `${new Date(filterList[key] as string)}`;
					}
				}
			}
			setQueryFilter({
				project: dashboardData?.project?.id,
				...newFilterListObject,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filterList]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dashboardData]);

	grantPeriodInputFields[3].optionsArray = donors?.orgDonors || [];

	if (loading) return <TableSkeleton />;

	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			{data?.grantPeriodsProjectList?.length ? (
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
						deleteGrantPeriod={setDeleteGrantPeriod}
					>
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
						<ImportExportTableMenuHoc refetchGrantPeriods={refetchGrantPeriods} />
					</SimpleTable>
					{grantPeriodToEdit && (
						<GrantPeriodDialog
							open={!!grantPeriodToEdit}
							onClose={() => {
								setGrantPeriodDialog(null);
								setDeleteGrantPeriod(false);
							}}
							action={FORM_ACTIONS.UPDATE}
							initialValues={(grantPeriodToEdit as any) as IGrantPeriod}
							dialogType={deleteGrantPeriod ? DIALOG_TYPE.DELETE : DIALOG_TYPE.FORM}
						/>
					)}
				</>
			) : (
				<Box
					m={2}
					display="flex"
					justifyContent="center"
					alignItems="center"
					flexDirection="column"
				>
					<Typography variant="subtitle1" gutterBottom color="textSecondary">
						<FormattedMessage
							id={`nodataFound`}
							defaultMessage={`No Data Found`}
							description={`This text will be shown if no data found for table`}
						/>
					</Typography>
					<ImportExportTableMenuHoc
						refetchGrantPeriods={refetchGrantPeriods}
						importButtonOnly={true}
					/>
				</Box>
			)}
		</>
	);

	// return <SimpleTable headers={headers} data={data?.grantPeriodsProjectList} />;
}
