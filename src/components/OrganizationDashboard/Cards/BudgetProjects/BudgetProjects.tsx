import { Box, Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import CommonProgres from "../CommonProgress";
import FilterListIcon from "@material-ui/icons/FilterList";
import MoreButton from "../MoreIconButton";
import ProgressDialog from "../ProgressDialog";

const budgetProjects = [
	{ name: "Wash Awarness ", completed: 90, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Covid 19 supply", completed: 80, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Budget Project ", completed: 70, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 4", completed: 60, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 5", completed: 50, lastUpdated: "2017-12-03T10:15:30.000Z" },
];

export default function BudgetProjectsCard() {
	const [budgetProjectFilter, setBudgetProjectFilter] = useState<{
		expenditure: boolean;
		allocation: boolean;
	}>({
		expenditure: true,
		allocation: false,
	});
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const [budgetProgressDialogOpen, setBudgetProgressDialogOpen] = React.useState(false);
	return (
		<Grid container>
			<Grid item md={10}>
				<Box mt={1}>
					<Typography color="primary" gutterBottom>
						<FormattedMessage
							id="budgetProjectCardTitle"
							defaultMessage="Project By "
							description="This text will be show on dashboard for budget project card title"
						/>
						{budgetProjectFilter.expenditure ? (
							<FormattedMessage
								id="expenditureButtonCards"
								defaultMessage="Expenditure"
								description="This text will be show on cards for expenditure button"
							/>
						) : (
							<FormattedMessage
								id="allocationButtonCards"
								defaultMessage="Allocation"
								description="This text will be show on cards for allocation button"
							/>
						)}
					</Typography>
				</Box>
			</Grid>
			<Grid item md={2}>
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
							setBudgetProjectFilter({
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
							setBudgetProjectFilter({
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
			</Grid>
			<Grid item md={12}>
				<Box mt={1}>
					{budgetProjects &&
						budgetProjects.slice(0, 3).map((budgetProject, index) => {
							return (
								<CommonProgres
									title={budgetProject.name}
									date={budgetProject.lastUpdated}
									percentage={budgetProject.completed}
									size="md"
								/>
							);
						})}
				</Box>
			</Grid>
			{budgetProgressDialogOpen && (
				<ProgressDialog
					open={budgetProgressDialogOpen}
					onClose={() => setBudgetProgressDialogOpen(false)}
					title={"Budget Projects"}
				>
					{budgetProjects &&
						budgetProjects.map((budgetProject, index) => {
							return (
								<Box m={2}>
									<CommonProgres
										title={budgetProject.name}
										date={budgetProject.lastUpdated}
										percentage={budgetProject.completed}
										size="lg"
									/>
								</Box>
							);
						})}
				</ProgressDialog>
			)}
			<Grid item md={9}></Grid>
			<Grid item md={3}>
				<MoreButton handleClick={() => setBudgetProgressDialogOpen(true)} />
			</Grid>
		</Grid>
	);
}
