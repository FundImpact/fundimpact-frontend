import { Box, Grid, IconButton, Menu, MenuItem, Typography, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { PieChart } from "../../../Charts";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
export default function BudgetCategoryCard() {
	const theme = useTheme();
	const [budgetCategoryFilter, setBudgetCategoryFilter] = useState<{
		expenditure: boolean;
		allocation: boolean;
	}>({
		expenditure: true,
		allocation: false,
	});

	let pieData = {
		datasets: [
			{
				backgroundColor: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.grey[200],
				],
				data: [500, 200, 300],
			},
		],
	};
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	return (
		<Grid container>
			<Grid item md={6}>
				<Box mt={1}>
					<Typography color="primary" noWrap gutterBottom>
						<FormattedMessage
							id="budgetCategoryCardTitle"
							defaultMessage="Budget Category"
							description="This text will be show on dashboard for budget category card title"
						/>
					</Typography>
				</Box>
			</Grid>
			<Grid item md={6}>
				<IconButton onClick={handleClick}>
					<FilterListIcon fontSize="small" />
				</IconButton>
				<Menu
					id="simple-menu-budget-org"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => {
							setBudgetCategoryFilter({
								expenditure: true,
								allocation: false,
							});

							handleClose();
						}}
					>
						<FormattedMessage
							id="expenditureButtonCards"
							defaultMessage="Expenditure"
							description="This text will be show on cards for expenditure button"
						/>
					</MenuItem>
					<MenuItem
						onClick={() => {
							setBudgetCategoryFilter({
								expenditure: false,
								allocation: true,
							});
							handleClose();
						}}
					>
						<FormattedMessage
							id="allocationButtonCards"
							defaultMessage="Allocation"
							description="This text will be show on cards for allocation button"
						/>
					</MenuItem>
				</Menu>
				<Typography variant="caption">
					{" "}
					<FormattedMessage
						id="moreHeadingCards"
						defaultMessage="more"
						description="This text will be show on cards for more heading"
					/>
				</Typography>
				<Link to="/settings/budget">
					<IconButton>
						<ArrowRightAltIcon fontSize="small" />
					</IconButton>
				</Link>
			</Grid>
			<Grid item md={12}>
				<PieChart data={pieData} />
			</Grid>
		</Grid>
	);
}
