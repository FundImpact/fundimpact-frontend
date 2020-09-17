import { Box, Button, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import CommonProgres from "../CommonProgress";

const budgetProjects = [
	{ name: "project 1", completed: 90, lastUpdated: "12-02-2020" },
	{ name: "project 2", completed: 80, lastUpdated: "12-02-2020" },
	{ name: "project 3", completed: 70, lastUpdated: "12-02-2020" },
	{ name: "project 4", completed: 60, lastUpdated: "12-02-2020" },
	{ name: "project 5", completed: 50, lastUpdated: "12-02-2020" },
];

export default function BudgetProjectsCard() {
	const [budgetProjectFilter, setBudgetProjectFilter] = useState<{
		expenditure: boolean;
		allocation: boolean;
	}>({
		expenditure: true,
		allocation: false,
	});
	return (
		<Box>
			<Typography color="primary" gutterBottom>
				{`Project by ${budgetProjectFilter.expenditure ? "Expenditure" : "Allocation"}`}
			</Typography>
			<Grid container>
				<Grid item md={8}>
					<Box display="flex">
						<Box>
							<Button
								color={budgetProjectFilter.expenditure ? "primary" : "default"}
								size="small"
								onClick={() =>
									setBudgetProjectFilter({
										expenditure: true,
										allocation: false,
									})
								}
							>
								<FormattedMessage
									id="expenditureButtonCards"
									defaultMessage="Expenditure"
									description="This text will be show on cards for expenditure button"
								/>
							</Button>
						</Box>
						<Box>
							<Button
								color={budgetProjectFilter.allocation ? "primary" : "default"}
								size="small"
								onClick={() =>
									setBudgetProjectFilter({
										expenditure: false,
										allocation: true,
									})
								}
							>
								<FormattedMessage
									id="allocationButtonCards"
									defaultMessage="Allocation"
									description="This text will be show on cards for allocation button"
								/>
							</Button>
						</Box>
					</Box>
				</Grid>
				<Grid item md={2}>
					<Button color={"primary"} size="small">
						See All
					</Button>
				</Grid>
				<Grid item md={2}>
					<Box ml={2}>
						<Typography variant="button">
							<FormattedMessage
								id="Top3HeadingCards"
								defaultMessage="Top 3"
								description="This text will be show on cards for top 3 heading"
							/>
						</Typography>
					</Box>
				</Grid>
			</Grid>
			<Box mt={1}>
				{budgetProjects &&
					budgetProjects.slice(0, 3).map((budgetProject, index) => {
						return (
							<CommonProgres
								title={budgetProject.name}
								date={budgetProject.lastUpdated}
								percentage={budgetProject.completed}
							/>
						);
					})}
			</Box>
		</Box>
	);
}
