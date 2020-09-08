import React, { useState } from "react";
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
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../Menu";
import { FORM_ACTIONS } from "../../../models/constants";
import {
	GET_ORGANIZATION_BUDGET_CATEGORY,
	GET_ORG_BUDGET_CATEGORY_COUNT,
} from "../../../graphql/Budget";
import { IBudgetCategory } from "../../../models/budget";
import pagination from "../../../hooks/pagination";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import TableSkeleton from "../../Skeletons/TableSkeleton";
import BudgetCategory from "../../Budget/BudgetCategory";
import { budgetCategoryHeading as tableHeading } from "../constants";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

const StyledTableHeader = makeStyles((theme: Theme) =>
	createStyles({
		th: { color: theme.palette.primary.main, fontSize: "13px" },
		tbody: {
			"& tr:nth-child(even) td": { background: "#F5F6FA" },
			"& td.MuiTableCell-root": {
				paddingTop: "1px",
				paddingBottom: "1px",
				fontSize: "13px",
			},
		},
	})
);

const keyNames = ["name", "code", "description"];

const getInitialValues = (budgetCategory: IBudgetCategory | null): IBudgetCategory => {
	return {
		code: budgetCategory?.code || "",
		description: budgetCategory?.description || "",
		id: budgetCategory?.id || "",
		name: budgetCategory?.name || "",
	};
};

function getValue(obj: any, key: string[]): any {
	if (!obj?.hasOwnProperty(key[0])) {
		return "";
	}
	if (key.length == 1) {
		return obj[key[0]];
	}
	return getValue(obj[key[0]], key.slice(1));
}

function BudgetCategoryTable() {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	const selectedBudgetCategory = React.useRef<IBudgetCategory | null>(null);
	const [page, setPage] = useState<number>(0);

	const dashboardData = useDashBoardData();

	const [openDialog, setOpenDialog] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	let {
		changePage,
		count,
		queryData: budgetCategoryList,
		queryLoading,
		countQueryLoading,
	} = pagination({
		countQuery: GET_ORG_BUDGET_CATEGORY_COUNT,
		countFilter: {
			organization: dashboardData?.organization?.id,
		},
		query: GET_ORGANIZATION_BUDGET_CATEGORY,
		queryFilter: {
			organization: dashboardData?.organization?.id,
		},
		sort: "created_at:DESC",
	});

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const menuList = [
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenDialog(true);
						handleClose();
					}}
				>
					Edit Budget Category
				</MenuItem>
			),
		},
	];

	if (countQueryLoading || queryLoading) {
		return <TableSkeleton />;
	}

	return (
		<TableContainer component={Paper}>
			<BudgetCategory
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenDialog(false)}
				initialValues={getInitialValues(selectedBudgetCategory.current)}
				open={openDialog}
			/>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{budgetCategoryList?.orgBudgetCategory?.length
							? tableHeading.map((heading: { label: string }, index: number) => (
									<TableCell className={tableHeader.th} key={index} align="left">
										{heading.label}
									</TableCell>
							  ))
							: null}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{budgetCategoryList?.orgBudgetCategory?.map(
						(budgetCategory: IBudgetCategory, index: number) => (
							<TableRow key={budgetCategory.id}>
								<TableCell component="td" scope="row">
									{page * 10 + index + 1}
								</TableCell>
								{keyNames.map((keyName: string, i: number) => {
									return (
										<TableCell key={i} align="left">
											{getValue(budgetCategory, keyName.split(","))}
										</TableCell>
									);
								})}
								<TableCell>
									<IconButton
										aria-haspopup="true"
										onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
											selectedBudgetCategory.current = budgetCategory;
											handleClick(event);
										}}
									>
										<MoreVertIcon />
									</IconButton>
									<SimpleMenu
										handleClose={handleClose}
										id={`organizationMenu-${budgetCategory.id}`}
										anchorEl={
											selectedBudgetCategory?.current?.id ===
											budgetCategory.id
												? anchorEl
												: null
										}
										menuList={menuList}
									/>
								</TableCell>
							</TableRow>
						)
					)}
				</TableBody>
				{budgetCategoryList?.orgBudgetCategory?.length ? (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[]}
								colSpan={8}
								count={count}
								rowsPerPage={count > 10 ? 10 : count}
								page={page}
								SelectProps={{
									inputProps: { "aria-label": "rows per page" },
									native: true,
								}}
								onChangePage={(
									event: React.MouseEvent<HTMLButtonElement> | null,
									newPage: number
								) => {
									if (newPage > page) {
										changePage();
									} else {
										changePage(true);
									}
									setPage(newPage);
								}}
								onChangeRowsPerPage={() => {}}
								style={{ paddingRight: "40px" }}
							/>
						</TableRow>
					</TableFooter>
				) : null}
			</Table>
		</TableContainer>
	);
}

export default React.memo(BudgetCategoryTable);
