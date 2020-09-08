import React, { useState } from "react";
import {
	TableRow,
	IconButton,
	TableCell,
	Collapse,
	Box,
	Grid,
	Typography,
	MenuItem,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { IBudgetTargetProjectResponse } from "../../../../models/budget/query";
import BudgetLineItemTable from "../BudgetLineItemTable";
import AmountSpent from "./AmountSpent";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SimpleMenu from "../../../Menu/";

function BudgetTargetTableRow({
	budgetTarget,
	currency,
	serialNo,
	menuId,
	selectedTargetBudget,
	setOpenBudgetLineItem,
	setOpenBudgetCategory,
}: {
	budgetTarget: IBudgetTargetProjectResponse;
	currency: string;
	serialNo: number;
	menuId: React.MutableRefObject<string>;
	selectedTargetBudget: React.MutableRefObject<IBudgetTargetProjectResponse | null>;
	setOpenBudgetLineItem: (args: boolean) => void;
	setOpenBudgetCategory: (args: boolean) => void;
}) {
	const [openRow, setOpenRow] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		menuId.current = budgetTarget.id;
		selectedTargetBudget.current = budgetTarget;
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
						setOpenBudgetCategory(true);
						handleClose();
					}}
				>
					Edit Budget Target
				</MenuItem>
			),
		},
		{
			children: (
				<MenuItem
					onClick={() => {
						setOpenBudgetLineItem(true);
						handleClose();
					}}
				>
					Report Expenditure
				</MenuItem>
			),
		},
	];

	return (
		<>
			<TableRow>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpenRow(!openRow)}
						data-testid={`collaspeButton-${serialNo}`}
					>
						{openRow ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>

				<TableCell component="td" scope="row">
					{serialNo}
				</TableCell>

				<TableCell align="left">{budgetTarget.name}</TableCell>
				<TableCell align="left">
					{budgetTarget?.budget_category_organization?.name}
				</TableCell>
				<TableCell align="left">{budgetTarget?.donor?.name}</TableCell>
				<TableCell align="left">{budgetTarget.total_target_amount}</TableCell>
				<TableCell align="left">
					<AmountSpent budgetTargetId={budgetTarget.id}>
						{(amount: number) => {
							return <span>{amount}</span>;
						}}
					</AmountSpent>
				</TableCell>
				<TableCell align="left">
					<AmountSpent budgetTargetId={budgetTarget.id}>
						{(amount: number) => {
							return (
								<span>
									{(
										(amount * 100) /
										parseInt(budgetTarget.total_target_amount)
									).toFixed(2)}
								</span>
							);
						}}
					</AmountSpent>
				</TableCell>

				<TableCell>
					<IconButton aria-haspopup="true" onClick={handleClick}>
						<MoreVertIcon />
					</IconButton>
					<SimpleMenu
						handleClose={handleClose}
						id={`organizationMenu-${budgetTarget.id}`}
						anchorEl={menuId.current === budgetTarget.id ? anchorEl : null}
						menuList={menuList}
					/>
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
					<Collapse in={openRow} timeout="auto" unmountOnExit>
						<Box m={1}>
							<Grid container>
								<Grid item xs={12}>
									<Box m={1}>
										<Typography
											align="left"
											variant="subtitle1"
											style={{
												fontSize: "0.8rem",
											}}
											variantMapping={{
												subtitle1: "h1",
											}}
										>
											{budgetTarget?.description || ""}
										</Typography>
									</Box>
								</Grid>
							</Grid>
							<BudgetLineItemTable
								budgetTargetId={budgetTarget.id}
								currency={currency}
							/>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

export default BudgetTargetTableRow;
