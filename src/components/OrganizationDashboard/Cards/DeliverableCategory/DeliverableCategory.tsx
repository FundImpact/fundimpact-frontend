import { Box, Button, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
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
								<FormattedMessage
									id="projectsButtonCards"
									defaultMessage="Projects"
									description="This text will be show on cards for project button"
								/>
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
