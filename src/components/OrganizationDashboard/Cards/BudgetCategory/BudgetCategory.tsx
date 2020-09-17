import { Box, Button, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { PieChart } from "../../../Charts";

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

	return (
		<Box>
			<Grid container>
				<Grid item md={8}>
					<Box display="flex">
						<Box>
							<Button
								color={budgetCategoryFilter.expenditure ? "primary" : "default"}
								size="small"
								onClick={() =>
									setBudgetCategoryFilter({
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
								color={budgetCategoryFilter.allocation ? "primary" : "default"}
								size="small"
								onClick={() =>
									setBudgetCategoryFilter({
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
			</Grid>
			<Box mt={1}>
				<PieChart data={pieData} />
			</Box>
		</Box>
	);
}
