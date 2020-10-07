import { Grid, Box, Typography } from "@material-ui/core";
import React from "react";
import MoreButton from "../MoreIconButton";
import ProgressDialog from "../ProgressDialog";
import CommonProgres from "../CommonProgress";
import { ProgressCardConfig, ProgressCardResponse } from "../../../../models/cards/cards";
import { Skeleton } from "@material-ui/lab";
import { FormattedMessage } from "react-intl";
import { AccountBox } from "@material-ui/icons";
import { abbreviateNumber } from "../../../../utils";
export function ProgressCard(progressCardConfig: ProgressCardConfig) {
	const {
		dataToDisplay,
		dialogTitle,
		noBarDisplay = false,
		noBarDisplayTitle,
		dialogFilterTitle,
		loading,
	} = progressCardConfig;
	const [progressDialogOpen, setProgressDialogOpen] = React.useState(false);
	if (!dataToDisplay || loading) {
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
				<Grid item md={12}>
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

			{noBarDisplayTitle &&
				noBarDisplayTitle?.length > 0 &&
				noBarDisplayTitle?.map((label, index) => (
					<Grid item xs={4} key={index}>
						<Box mt={1} mb={1} mr={1}>
							<Typography color="primary" gutterBottom noWrap>
								{label}
							</Typography>
						</Box>
					</Grid>
				))}
			<Grid style={{ height: noBarDisplay ? "130px" : "180px" }}>
				{dataToDisplay?.length > 0 && (
					<Grid item md={12} container>
						{dataToDisplay?.length > 0 &&
							dataToDisplay
								.slice(0, dataToDisplay.length > 3 ? 3 : dataToDisplay.length)
								.map((data: ProgressCardResponse, index) => {
									return (
										<CommonProgres
											key={index}
											title={data.name}
											date={"2017-12-03T10:15:30.000Z"}
											norBarDisplayConfig={{
												sum: data.sum ? abbreviateNumber(data.sum) : 0,
												sum_two: data.sum_two
													? abbreviateNumber(data.sum_two)
													: 0,
											}}
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
					</Grid>
				)}
			</Grid>

			{progressDialogOpen && (
				<ProgressDialog
					open={progressDialogOpen}
					onClose={() => setProgressDialogOpen(false)}
					title={dialogTitle ? dialogTitle : " "}
					filterTitle={dialogFilterTitle ? dialogFilterTitle : ""}
				>
					<>
						<Grid container>
							{noBarDisplayTitle &&
								noBarDisplayTitle?.length > 0 &&
								noBarDisplayTitle?.map((label, index) => (
									<Grid item xs={4}>
										<Box m={1} key={index}>
											<Typography color="primary" gutterBottom noWrap>
												{label}
											</Typography>
										</Box>
									</Grid>
								))}
						</Grid>

						{dataToDisplay &&
							dataToDisplay.map((data: ProgressCardResponse, index) => {
								return (
									<Box m={1} key={index}>
										<CommonProgres
											key={index}
											title={data.name}
											norBarDisplayConfig={{
												sum: data.sum ? data.sum : 0,
												sum_two: data.sum_two ? data.sum_two : 0,
											}}
											// date={"2017-12-03T10:15:30.000Z"}

											chartConfig={{
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
											}}
											noBarDisplay={noBarDisplay}
											size="dialog"
										/>
									</Box>
								);
							})}
					</>
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
