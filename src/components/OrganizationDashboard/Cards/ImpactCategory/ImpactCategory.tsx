import { Box, Button, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { PieChart } from "../../../Charts";

export default function ImpactCategoryCard() {
	const theme = useTheme();
	const [impactCategoryFilter, setImpactCategoryFilter] = useState<{
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
				data: [5000, 3000, 1500],
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
								color={impactCategoryFilter.projects ? "primary" : "default"}
								size="small"
								onClick={() =>
									setImpactCategoryFilter({
										projects: true,
										achieved: false,
									})
								}
							>
								<FormattedMessage
									id="projectsButtonCards"
									defaultMessage="Projects"
									description="This text will be show on cards for project button"
								/>
							</Button>
						</Box>
						<Box>
							<Button
								color={impactCategoryFilter.achieved ? "primary" : "default"}
								size="small"
								onClick={() =>
									setImpactCategoryFilter({
										projects: false,
										achieved: true,
									})
								}
							>
								<FormattedMessage
									id="achievedButtonCards"
									defaultMessage="Achieved"
									description="This text will be show on cards for achieved button"
								/>
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
