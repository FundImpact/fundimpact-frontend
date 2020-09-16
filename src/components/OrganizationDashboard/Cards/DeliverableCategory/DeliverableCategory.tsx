import { Box, Button, Grid, Typography } from "@material-ui/core";
import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { PieChart } from "../../../Charts";

export default function DeliverableCategoryCard() {
	const theme = useTheme();
	const [deliverableCategoryFilter, setdeliverableCategoryFilter] = useState<{
		projects: boolean;
		achieved: boolean;
	}>({
		projects: true,
		achieved: false,
	});

	let DeliverablePieData = {
		datasets: [
			{
				backgroundColor: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.grey[200],
				],
				data: [1000, 200, 300],
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
								color={deliverableCategoryFilter.projects ? "primary" : "default"}
								size="small"
								onClick={() =>
									setdeliverableCategoryFilter({
										projects: true,
										achieved: false,
									})
								}
							>
								Projects
							</Button>
						</Box>
						<Box>
							<Button
								color={deliverableCategoryFilter.achieved ? "primary" : "default"}
								size="small"
								onClick={() =>
									setdeliverableCategoryFilter({
										projects: false,
										achieved: true,
									})
								}
							>
								Achieved
							</Button>
						</Box>
					</Box>
				</Grid>
			</Grid>
			<Box mt={1}>
				<PieChart data={DeliverablePieData} />
			</Box>
		</Box>
	);
}
