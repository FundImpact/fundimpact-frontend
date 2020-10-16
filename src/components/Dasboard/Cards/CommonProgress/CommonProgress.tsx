import { Box, Grid, Typography } from "@material-ui/core";
import React, { ReactText } from "react";
import { ChartBullet, ChartThemeColor } from "@patternfly/react-charts";

export default function CommonProgress({
	title,
	date,
	noBarDisplay = false,
	norBarDisplayConfig,
	chartConfig,
	size = "card",
}: {
	title: string;
	date?: string;

	noBarDisplay?: boolean;
	chartConfig?: {
		primarySegmentedMeasureData: { name: string; y: number }[];
		qualitativeRangeData: { name: string; y: number }[];
	};
	size?: "card" | "dialog";
	norBarDisplayConfig?: {
		sum: number | ReactText;
		sum_two: number | ReactText;
	};
}) {
	return (
		<Grid container style={{ width: "100%" }}>
			{!noBarDisplay && (
				<>
					<Grid item xs={3}>
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
					<Grid item xs={4}>
						<Box>
							<Typography variant="subtitle2" noWrap>
								{title}
							</Typography>
						</Box>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="subtitle2" color="secondary">
							{norBarDisplayConfig?.sum}
						</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="subtitle2" color="secondary">
							{norBarDisplayConfig?.sum_two}
						</Typography>
					</Grid>
				</>
			)}
		</Grid>
	);
}
