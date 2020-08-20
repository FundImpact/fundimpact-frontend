import { IconButton, MenuItem, Table, Box, Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import { useLazyQuery, useApolloClient, useQuery } from "@apollo/client";
import { GET_BUDGET_TARGET_PROJECT } from "../../../graphql/queries/budget";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
	IBudgetTargetProjectResponse,
	IGET_BUDGET_TARGET_PROJECT,
} from "../../../models/budget/query";
import React, { useState } from "react";
import CreateBudgetTargetDialog from "../../Budget/CreateBudgetTargetDialog";
import { FORM_ACTIONS } from "../../../models/budget/constants";
import SimpleMenu from "../../Menu/Menu";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GET_PROJECT_BUDGET_TARCKING } from "../../../graphql/queries/budget/query";
import { IBudgetTargetForm } from "../../../models/budget/budgetForm";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Collapse from "@material-ui/core/Collapse";
import BudgetTrackingLineItemTable from "../BudgetTrackingLineItemTable";

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

const tableHeading = [
	{ label: "" },
	{ label: "S.no" },
	{ label: "Organization Currency" },
	{ label: "Name" },
	{ label: "Budget Category" },
	{ label: "Total Target Amount" },
	{ label: "Conversion Factor" },
];

function getInitialValues(
	budgetTargetsProject: IBudgetTargetProjectResponse | null
): IBudgetTargetForm {
	return {
		name: budgetTargetsProject ? budgetTargetsProject.name : "",
		description: budgetTargetsProject ? budgetTargetsProject.description : "",
		total_target_amount: budgetTargetsProject ? budgetTargetsProject.total_target_amount : "",
		conversion_factor: budgetTargetsProject ? budgetTargetsProject.conversion_factor : "",
		id: budgetTargetsProject ? budgetTargetsProject.id : "",
		organization_currency: budgetTargetsProject
			? budgetTargetsProject.organization_currency.id
			: "",
		budget_category_organization: budgetTargetsProject
			? budgetTargetsProject.budget_category_organization.id
			: "",
	};
}

const projectcBudgetTarcking: any = {};

function BudgetTargetTable() {
	const classes = useStyles();
	const apolloClient = useApolloClient();
	const tableHeader = StyledTableHeader();
	const menuId = React.useRef("");
	const selectedTargetBudget = React.useRef<IBudgetTargetProjectResponse | null>(null);
	const currentProject = useDashBoardData()?.project;
	const [openTableRows, setOpenTableRows] = useState<boolean[]>([]);

	const [getProjectBudgetTrackingData] = useLazyQuery(GET_PROJECT_BUDGET_TARCKING);

	const [loadBudgetTarget] = useLazyQuery(GET_BUDGET_TARGET_PROJECT, {
		variables: {
			filter: {
				project: currentProject?.id,
			},
		},
	});
	const [openDialog, setOpenDialog] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	let oldCachedBudgetTargetProjectData: IGET_BUDGET_TARGET_PROJECT | null = null;
	try {
		oldCachedBudgetTargetProjectData = apolloClient.readQuery<IGET_BUDGET_TARGET_PROJECT>({
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project: currentProject?.id,
				},
			},
		});
	} catch (error) {}

	let oldCachedProjectBudgetTrackingData: any = null;
	try {
		oldCachedProjectBudgetTrackingData = apolloClient.readQuery({
			query: GET_PROJECT_BUDGET_TARCKING,
		});
	} catch (error) {}

	React.useEffect(() => {
		if (!oldCachedProjectBudgetTrackingData) {
			getProjectBudgetTrackingData();
		}
	}, [oldCachedProjectBudgetTrackingData]);

	React.useEffect(() => {
		if (currentProject && !oldCachedBudgetTargetProjectData) {
			loadBudgetTarget();
		}
	}, [currentProject]);

	React.useEffect(() => {
		if (oldCachedBudgetTargetProjectData) {
			let arr = oldCachedBudgetTargetProjectData.projectBudgetTargets.map(() => false);
			setOpenTableRows(arr);
		}
	}, [oldCachedBudgetTargetProjectData]);

	//change any and rename ele and change to old cache
	React.useEffect(() => {
		if (oldCachedProjectBudgetTrackingData) {
			oldCachedProjectBudgetTrackingData.projBudgetTrackings.forEach((ele: any) => {
				if (!projectcBudgetTarcking[ele.budget_targets_project.id]) {
					projectcBudgetTarcking[ele.budget_targets_project.id] = [];
				}
				projectcBudgetTarcking[ele.budget_targets_project.id].push(ele);
			});
		}
	}, [oldCachedProjectBudgetTrackingData]);

	console.log("oldCachedProjectBudgetTrackingData :>> ", oldCachedProjectBudgetTrackingData);
	console.log("projectcBudgetTarcking :>> ", projectcBudgetTarcking);

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
					Edit Budget Target
				</MenuItem>
			),
		},
	];

	return (
		<TableContainer component={Paper}>
			<CreateBudgetTargetDialog
				open={openDialog}
				handleClose={() => {
					setOpenDialog(false);
					selectedTargetBudget.current = null;
					menuId.current = "";
				}}
				formAction={FORM_ACTIONS.UPDATE}
				initialValues={getInitialValues(selectedTargetBudget.current)}
			/>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow color="primary">
						{tableHeading.map((heading) => (
							<TableCell className={tableHeader.th} key={heading.label} align="left">
								{heading.label}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody className={tableHeader.tbody}>
					{/* {wirte here loading} */}
					{oldCachedBudgetTargetProjectData
						? oldCachedBudgetTargetProjectData.projectBudgetTargets.map(
								(
									budgetTargetsProject: IBudgetTargetProjectResponse,
									index: number
								) => (
									<>
										<TableRow key={budgetTargetsProject.id}>
											<TableCell>
												<IconButton
													aria-label="expand row"
													size="small"
													onClick={() =>
														setOpenTableRows(
															(
																openTableRowsArr: boolean[]
															): boolean[] => {
																openTableRowsArr[
																	index
																] = !openTableRowsArr[index];
																return [...openTableRowsArr];
															}
														)
													}
												>
													{openTableRows[index] ? (
														<KeyboardArrowUpIcon />
													) : (
														<KeyboardArrowDownIcon />
													)}
												</IconButton>
											</TableCell>
											<TableCell component="td" scope="row">
												{index + 1}
											</TableCell>
											<TableCell align="left">
												{
													budgetTargetsProject?.organization_currency
														?.currency?.name
												}
											</TableCell>
											<TableCell align="left">
												{budgetTargetsProject.name}
											</TableCell>
											<TableCell align="left">
												{
													budgetTargetsProject
														.budget_category_organization.name
												}
											</TableCell>
											<TableCell align="left">
												{budgetTargetsProject.total_target_amount}
											</TableCell>
											<TableCell align="left">
												{budgetTargetsProject.conversion_factor}
											</TableCell>
											<TableCell>
												<IconButton
													aria-haspopup="true"
													onClick={(
														event: React.MouseEvent<HTMLButtonElement>
													) => {
														menuId.current = budgetTargetsProject.id;
														selectedTargetBudget.current = budgetTargetsProject;
														handleClick(event);
													}}
												>
													<MoreVertIcon />
												</IconButton>
												<SimpleMenu
													handleClose={handleClose}
													id={`organizationMenu-${budgetTargetsProject.id}`}
													anchorEl={
														menuId.current == budgetTargetsProject.id
															? anchorEl
															: null
													}
													menuList={menuList}
												/>
											</TableCell>
										</TableRow>
										<TableRow>
											<TableCell
												style={{ paddingBottom: 0, paddingTop: 0 }}
												colSpan={8}
											>
												<Collapse
													in={openTableRows[index]}
													timeout="auto"
													unmountOnExit
												>
													<Box m={1}>
														{projectcBudgetTarcking[
															budgetTargetsProject.id
														] && (
															<BudgetTrackingLineItemTable
																budgetTrackingLineItems={
																	projectcBudgetTarcking[
																		budgetTargetsProject.id
																	]
																}
															/>
														)}
													</Box>
												</Collapse>
											</TableCell>
										</TableRow>
									</>
								)
						  )
						: null}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default React.memo(BudgetTargetTable);
