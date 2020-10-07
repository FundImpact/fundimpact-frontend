import { Box, Grid, Typography, useTheme } from "@material-ui/core";
import React from "react";
import BorderLinearProgress from "../../../BorderLinearProgress";
import { ChartAxis, ChartBullet, ChartThemeColor } from "@patternfly/react-charts";

export default function CommonProgress({
	title,
	date,
	percentage,
	noBarDisplay = false,
	chartConfig,
	size = "card",
}: {
	title: string;
	date?: string;
	percentage: number;
	noBarDisplay?: boolean;
	chartConfig?: {
		primarySegmentedMeasureData: { name: string; y: number }[];
		qualitativeRangeData: { name: string; y: number }[];
	};
	size?: "card" | "dialog";
}) {
	const theme = useTheme();
	let maxDomain = 100;
	if (percentage > 100) {
		maxDomain = percentage;
	}

	return (
		<Grid container style={{ width: "100%" }}>
			{!noBarDisplay && (
				<>
					<Grid xs={3}>
						<Box mt={1}>
							<Typography noWrap>{title}</Typography>
						</Box>
					</Grid>
					<Grid
						item
						xs={9}
						style={{ height: size === "dialog" ? "90px" : "60px", width: "100%" }}
					>
						<ChartBullet
							ariaTitle={title}
							comparativeErrorMeasureData={[{ name: "Target", y: 100 }]}
							maxDomain={{ y: maxDomain }}
							labels={({ datum }) => `${datum.name}: ${datum.y}`}
							padding={{
								left: 20, // Adjusted to accommodate labels
								right: 30,
								bottom: 90,
							}}
							primarySegmentedMeasureData={chartConfig?.primarySegmentedMeasureData}
							height={100}
							themeColor={ChartThemeColor.green}
							qualitativeRangeData={chartConfig?.qualitativeRangeData}
						/>
					</Grid>
				</>
			)}
			{noBarDisplay && (
				<>
					<Grid item md={6}>
						<Box m={1} mt={0}>
							<Typography variant="subtitle2" noWrap>
								{title}
							</Typography>
						</Box>
					</Grid>
					<Grid item md={6} container>
						<Grid item md={11} container justify="flex-end">
							<Typography variant="subtitle2" color="secondary">{`₹
						${percentage}`}</Typography>
						</Grid>
					</Grid>
				</>
			)}
		</Grid>
	);
}
