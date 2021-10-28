import React, { useEffect, useState, useRef } from "react";
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	IconButton,
	MenuItem,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { createStyles, makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import { units } from "./dummyData.json";
// import pagination from "../../../hooks/pagination";
// import {
// 	GET_DELIVERABLE_ORG_CATEGORY_COUNT,
// 	GET_DELIVERABLE_ORG_CATEGORY,
// } from "../../../graphql/Deliverable/orgCategory";
import SimpleMenu from "../../Menu";
import { FormattedMessage } from "react-intl";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import Unit from "../../Unit";
import { FORM_ACTIONS } from "../../../models/constants";
import { IUnits } from "../../../models/units";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const styledTable = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
		tbody: {
			"& tr:nth-child(odd) td": { background: theme.palette.action.hover },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
				fontSize: "13px",
			},
		},
	})
);

const getInitialValues = (unit: IUnits | null): IUnits => {
	return {
		id: unit?.id || "",
		name: unit?.name || "",
		code: unit?.code || "",
		description: unit?.description || "",
	};
};

const UnitsTable = () => {
	const classes = useStyles();
	const tableStyles = styledTable();
	const selectedUnit = useRef<any | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [page, setPage] = useState<number>(0);
	const [queryFilter, setQueryFilter] = useState({});
	const [pageCount, setPageCount] = useState(0);
	const [openUnitEditDialog, setOpenUnitEditDialog] = useState<boolean>(false);
	const [openUnitDeleteDialog, setOpenUnitDeleteDialog] = useState<boolean>(false);

	// let {
	// 	changePage: deliverableChangePage,
	// 	count: deliverableCatCount,
	// 	queryData: deliverableCatList,
	// 	queryLoading: deliverableQueryLoading,
	// 	countQueryLoading: deliverableCountQueryLoading,
	// 	queryRefetch: refetchDeliverableCatList,
	// 	countRefetch: refetchDeliverableCatCount,
	// } = pagination({
	// 	countQuery: GET_DELIVERABLE_ORG_CATEGORY_COUNT,
	// 	countFilter: {},
	// 	query: GET_DELIVERABLE_ORG_CATEGORY,
	// 	queryFilter,
	// 	sort: `${orderBy}:${order.toUpperCase()}`,
	// });

	// useEffect(() => {
	// 	if (deliverableCatCount?.aggregate?.count) {
	// 		setPageCount(deliverableCatCount.aggregate.count);
	// 	}
	// }, [deliverableCatCount]);

	// console.log("Data: ", deliverableCatList);
	// console.log("Count: ", deliverableCatCount);

	const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const menuList = [
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenUnitEditDialog(true);
						handleMenuClose();
					}}
				>
					<FormattedMessage
						id="editUnit"
						defaultMessage="Edit"
						description="This text will be shown on menu item to edit Unit"
					/>
				</MenuItem>
			),
		},
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenUnitDeleteDialog(true);
						handleMenuClose();
					}}
				>
					<FormattedMessage
						id="deleteUnit"
						defaultMessage="Delete"
						description="This text will be shown on menu item to delete Unit"
					/>
				</MenuItem>
			),
		},
	];

	// Check for the loading
	if (false) {
		return <TableSkeleton />;
	}

	return (
		<TableContainer component={Paper}>
			<Unit
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenUnitEditDialog(false)}
				initialValues={getInitialValues(selectedUnit.current)}
				open={openUnitEditDialog}
			/>
			<Unit
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenUnitDeleteDialog(false)}
				initialValues={getInitialValues(selectedUnit.current)}
				open={openUnitDeleteDialog}
				deleteUnit={true}
			/>

			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						<TableCell>#</TableCell>
						<TableCell>Name</TableCell>
						<TableCell>Code</TableCell>
						<TableCell>Description</TableCell>
						<TableCell>Unit Type</TableCell>
						<TableCell>
							<IconButton>
								<MoreVertIcon />
							</IconButton>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody className={tableStyles.tbody}>
					{units.map((unit: IUnits, index: number) => (
						<TableRow key={unit.id}>
							<TableCell component="td" scope="row">
								{page * 10 + index + 1}
							</TableCell>
							<TableCell>{unit.name}</TableCell>
							<TableCell>{unit.code}</TableCell>
							<TableCell>{unit.description}</TableCell>
							<TableCell>{unit.deliverable_type_id?.name}</TableCell>
							<TableCell>
								<IconButton
									aria-haspopup="true"
									onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
										selectedUnit.current = unit;
										handleMenuClick(event);
									}}
									style={{
										visibility: true ? "visible" : "hidden",
									}}
								>
									<MoreVertIcon />
								</IconButton>
								{/* Edit Access */}
								{true && (
									<SimpleMenu
										handleClose={handleMenuClose}
										id={`organizationMenu-${unit.id}`}
										anchorEl={
											selectedUnit?.current?.id === unit.id ? anchorEl : null
										}
										menuList={menuList}
									/>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default UnitsTable;
