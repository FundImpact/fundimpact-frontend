import { Grid, Box, Typography } from "@material-ui/core";
import React from "react";
import MoreButton from "../MoreIconButton";
import ProgressDialog from "../ProgressDialog";
import CommonProgres from "../CommonProgress";
import { ProgressCardConfig, ProgressCardResponse } from "../../../../models/cards/cards";
import { Skeleton } from "@material-ui/lab";
import { FormattedMessage } from "react-intl";
export function ProgressCard(progressCardConfig: ProgressCardConfig) {
	const {
		dataToDisplay,
		dialogTitle,
		noBarDisplay = false,
		dialogFilterTitle,
	} = progressCardConfig;
	const [progressDialogOpen, setProgressDialogOpen] = React.useState(false);
	if (!dataToDisplay) {
		return (
			<Grid item md={12}>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
			</Grid>
		);
	}
	return (
		<>
			{!dataToDisplay?.length && (
				<Grid item md={12} justify="center" container>
					<Box mt={2} color="text.disabled">
						<Typography variant="subtitle2" noWrap>
							<FormattedMessage
								id={`noProjectFound`}
								defaultMessage={`No Project Found`}
								description={`This text will be shown if no category found for organization dashboard project card`}
							/>
						</Typography>
					</Box>
				</Grid>
			)}
			{dataToDisplay?.length > 0 && (
				<Grid item md={12} style={{ height: noBarDisplay ? "130px" : "180px" }}>
					<Box mt={1}>
						{dataToDisplay?.length > 0 &&
							dataToDisplay
								.slice(0, dataToDisplay.length > 3 ? 3 : dataToDisplay.length)
								.map((data: ProgressCardResponse, index) => {
									return (
										<CommonProgres
											key={index}
											title={data.name}
											date={"2017-12-03T10:15:30.000Z"}
											percentage={
												data.sum
													? data.sum
													: data.avg_value_two && data.avg_value
													? Math.max(data.avg_value_two, data.avg_value)
													: data.avg_value
													? data.avg_value
													: 0
											}
											chartConfig={{
												primarySegmentedMeasureData: data.label
													? [
															/**/
															{
																name: data.label,
																y: data.avg_value
																	? data.avg_value
																	: 0,
															},
													  ]
													: [
															/*Here Achieved is used for deliverable and impact */
															{
																name: "Achieved",
																y: data.avg_value
																	? data.avg_value
																	: 0,
															},
													  ],
												qualitativeRangeData: data.labelTwo
													? [
															/*Here we can add one more range for now its empty */
															{
																name: "",
																y: 0,
															},
															{
																name: data.labelTwo,
																y: data.avg_value_two
																	? data.avg_value_two
																	: 0,
															},
													  ]
													: [],
											}}
											noBarDisplay={noBarDisplay}
										/>
									);
								})}
					</Box>
				</Grid>
			)}

			{progressDialogOpen && (
				<ProgressDialog
					open={progressDialogOpen}
					onClose={() => setProgressDialogOpen(false)}
					title={dialogTitle ? dialogTitle : " "}
					filterTitle={dialogFilterTitle ? dialogFilterTitle : ""}
				>
					{dataToDisplay &&
						dataToDisplay.map((data: ProgressCardResponse, index) => {
							return (
								<Box m={1} key={index}>
									<CommonProgres
										key={index}
										title={data.name}
										// date={"2017-12-03T10:15:30.000Z"}
										percentage={
											data.sum
												? data.sum
												: data.avg_value_two && data.avg_value
												? Math.max(data.avg_value_two, data.avg_value)
												: data.avg_value
												? data.avg_value
												: 0
										}
										chartConfig={{
											primarySegmentedMeasureData: data.label
												? [
														/**/
														{
															name: data.label,
															y: data.avg_value ? data.avg_value : 0,
														},
												  ]
												: [
														/*Here Achieved is used for deliverable and impact */
														{
															name: "Achieved",
															y: data.avg_value ? data.avg_value : 0,
														},
												  ],
											qualitativeRangeData: data.labelTwo
												? [
														/*Here we can add one more range for now its empty */
														{
															name: "",
															y: 0,
														},
														{
															name: data.labelTwo,
															y: data.avg_value_two
																? data.avg_value_two
																: 0,
														},
												  ]
												: [],
										}}
										noBarDisplay={noBarDisplay}
										size="dialog"
									/>
								</Box>
							);
						})}
				</ProgressDialog>
			)}
			{dataToDisplay?.length > 0 && (
				<Grid justify="flex-end" container>
					<Box>
						<MoreButton handleClick={() => setProgressDialogOpen(true)} />
					</Box>
				</Grid>
			)}
		</>
	);
}
