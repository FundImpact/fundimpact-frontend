import { Box, Button, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import CommonProgres from "../CommonProgress";

const budgetProjects = [
	{ name: "project 1", completed: 90, lastUpdated: "12-02-2020" },
	{ name: "project 2", completed: 80, lastUpdated: "12-02-2020" },
	{ name: "project 3", completed: 70, lastUpdated: "12-02-2020" },
	{ name: "project 4", completed: 60, lastUpdated: "12-02-2020" },
	{ name: "project 5", completed: 50, lastUpdated: "12-02-2020" },
];

export default function BudgetProjectsCard() {
	const [filterByExperditureOrAllocation, setFilterByExpenditureOrAllocation] = useState<string>(
		"exp"
	);
	return (
		<Box>
			<Typography color="primary" gutterBottom>
				{`Project by ${
					filterByExperditureOrAllocation === "exp" ? "Expenditure" : "Allocation"
				}`}
			</Typography>
			<Grid container>
				<Grid item md={8}>
					<Box display="flex">
						<Box>
							<Button
								color={
									filterByExperditureOrAllocation === "exp"
										? "primary"
										: "default"
								}
								size="small"
								onClick={() => setFilterByExpenditureOrAllocation("exp")}
							>
								Expenditure
							</Button>
						</Box>
						<Box ml={1} mr={1}>
							<Typography variant="caption">|</Typography>
						</Box>
						<Box>
							<Button
								color={
									filterByExperditureOrAllocation === "all"
										? "primary"
										: "default"
								}
								size="small"
								onClick={() => setFilterByExpenditureOrAllocation("all")}
							>
								Allocation
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
						<Typography variant="button">Top 3</Typography>
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
