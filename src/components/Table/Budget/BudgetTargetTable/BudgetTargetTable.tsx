import { Table, TableFooter } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { useQuery } from "@apollo/client";
import { GET_BUDGET_TARGET_PROJECT } from "../../../../graphql/Budget";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { IBudgetTargetProjectResponse } from "../../../../models/budget/query";
import { GET_PROJECT_BUDGET_TARGETS_COUNT } from "../../../../graphql/Budget";
import React, { useState, useEffect } from "react";
import BudgetTarget from "../../../Budget/BudgetTarget";

import { FORM_ACTIONS } from "../../../../models/budget/constants";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { IBudgetTargetForm } from "../../../../models/budget/budgetForm";
import { IBudgetTrackingLineitemForm } from "../../../../models/budget/budgetForm";
import { getTodaysDate } from "../../../../utils";
import BudgetLineitem from "../../../Budget/BudgetLineitem";
import { GET_ORG_CURRENCIES_BY_ORG } from "../../../../graphql";
import pagination from "../../../../hooks/pagination";
import TablePagination from "@material-ui/core/TablePagination";
import BudgetTargetTableRow from "./BudgetTargetTableRow";

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
	pagination: {
		paddingRight: "40px",
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

const getBudgetLineitemInitialvalues = (
	budget_targets_project: string
): IBudgetTrackingLineitemForm => {
	return {
		amount: "",
		note: "",
		budget_targets_project,
		annual_year: "",
		reporting_date: getTodaysDate(),
		fy_donor: "",
		fy_org: "",
		grant_periods_project: "",
	};
};

function getInitialValues(budgetTarget: IBudgetTargetProjectResponse | null): IBudgetTargetForm {
	return {
		name: budgetTarget ? budgetTarget.name : "",
		description: budgetTarget ? budgetTarget.description : "",
		total_target_amount: budgetTarget ? budgetTarget.total_target_amount : "",
		id: budgetTarget ? budgetTarget.id : "",
		budget_category_organization: budgetTarget
			? budgetTarget?.budget_category_organization?.id
			: "",
		donor: budgetTarget ? budgetTarget?.donor?.id : "",
	};
}

const tableHeading = [
	{ label: "" },
	{ label: "S.no" },
	{ label: "Target Name" },
	{ label: "Budget Category" },
	{ label: "Donor" },
	{ label: "Total Amount" },
	{ label: "Spent" },
	{ label: "Progress %" },
	{ label: "" },
];

function BudgetTargetTable() {
	const classes = useStyles();
	const tableHeader = StyledTableHeader();
	const menuId = React.useRef<string>("");
	const selectedTargetBudget = React.useRef<IBudgetTargetProjectResponse | null>(null);
	const dashboardData = useDashBoardData();
	const currentProject = dashboardData?.project;

	const [openBudgetTarget, setOpenBudgetTarget] = useState<boolean>(false);
	const [openBudgetLineItem, setOpenBudgetLineItem] = useState(false);
	const [page, setPage] = React.useState(0);

	let { count, queryData: budgetTargetData, changePage } = pagination({
		query: GET_BUDGET_TARGET_PROJECT,
		countQuery: GET_PROJECT_BUDGET_TARGETS_COUNT,
		countFilter: {
			project: currentProject?.id,
		},
		queryFilter: {
			project: currentProject?.id,
		},
		sort: "created_at:DESC",
	});
	const { data: orgCurrencies } = useQuery(GET_ORG_CURRENCIES_BY_ORG, {
		variables: {
			filter: {
				organization: dashboardData?.organization?.id,
				isHomeCurrency: true,
			},
		},
	});

	useEffect(() => {
		setPage(0);
	}, [currentProject]);

	const reInitializeRef = (): void => {
		selectedTargetBudget.current = null;
		menuId.current = "";
	};

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		if (newPage > page) {
			changePage();
		} else {
			changePage(true);
		}
		setPage(newPage);
	};

	return (
		<TableContainer component={Paper}>
			<BudgetTarget
				open={openBudgetTarget}
				handleClose={() => {
					setOpenBudgetTarget(false);
					reInitializeRef();
				}}
				formAction={FORM_ACTIONS.UPDATE}
				initialValues={getInitialValues(selectedTargetBudget.current)}
			/>
			<BudgetLineitem
				open={openBudgetLineItem}
				handleClose={() => {
					setOpenBudgetLineItem(false);
					reInitializeRef();
				}}
				formAction={FORM_ACTIONS.CREATE}
				initialValues={getBudgetLineitemInitialvalues(
					selectedTargetBudget.current ? selectedTargetBudget.current.id : ""
				)}
			/>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{tableHeading.map((heading: { label: string }, index: number) => (
							<TableCell className={tableHeader.th} key={index} align="left">
								{heading.label === "Total Amount"
									? `Total Amount (${
											orgCurrencies?.orgCurrencies[0]?.currency.code
												? orgCurrencies?.orgCurrencies[0]?.currency.code
												: ""
									  })`
									: heading.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{budgetTargetData?.projectBudgetTargets?.map(
						(budgetTarget: IBudgetTargetProjectResponse, index: number) => (
							<BudgetTargetTableRow
								budgetTarget={budgetTarget}
								key={budgetTarget.id}
								currency={
									orgCurrencies?.orgCurrencies[0]?.currency.code
										? orgCurrencies?.orgCurrencies[0]?.currency.code
										: ""
								}
								serialNo={page * 10 + index + 1}
								menuId={menuId}
								selectedTargetBudget={selectedTargetBudget}
								setOpenBudgetLineItem={setOpenBudgetLineItem}
								setOpenBudgetCategory={setOpenBudgetTarget}
							/>
						)
					)}
				</TableBody>
				{budgetTargetData?.projectBudgetTargets?.length ? (
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[]}
								colSpan={9}
								count={count}
								rowsPerPage={count > 10 ? 10 : count}
								page={page}
								onChangePage={handleChangePage}
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

export default React.memo(BudgetTargetTable);
