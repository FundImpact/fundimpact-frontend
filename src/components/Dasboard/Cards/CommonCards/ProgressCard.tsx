import {
	Grid,
	Box,
	Typography,
	TableRow,
	TableCell,
	TableBody,
	TableContainer,
	Table,
	TableHead,
} from "@material-ui/core";
import React from "react";
import MoreButton from "../MoreIconButton";
import ProgressDialog from "../ProgressDialog";
import CommonProgres from "../CommonProgress";
import { ProgressCardConfig, ProgressCardResponse } from "../../../../models/cards/cards";
import { Skeleton } from "@material-ui/lab";
import { FormattedMessage, useIntl } from "react-intl";
import { abbreviateNumber } from "../../../../utils";

const ProgessCardTable = ({
	labels,
	rows,
	useAbbreviateNumber = false,
}: {
	labels: string[];
	rows: ProgressCardResponse[];
	useAbbreviateNumber?: boolean;
}) => {
	return (
		<TableContainer>
			<Table aria-label="simple table" size="small" padding="none">
				<TableHead>
					<TableRow>
						{labels?.map((label: any) => (
							<TableCell align="center">
								<Box mr={1}>
									<Typography color="primary" gutterBottom noWrap>
										{label}
									</Typography>
								</Box>
							</TableCell>
						))}
					</TableRow>
				</TableHead>

				<TableBody>
					{rows.map((row: any) => (
						<TableRow key={row.id}>
							<TableCell align="center">
								<Typography variant="subtitle2">{row.name}</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="subtitle2" color="secondary">
									{useAbbreviateNumber ? abbreviateNumber(row.sum) : row.sum}
								</Typography>
							</TableCell>
							<TableCell align="center">
								<Typography variant="subtitle2" color="secondary">
									{useAbbreviateNumber
										? abbreviateNumber(row.sum_two)
										: row.sum_two}
								</Typography>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
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
	const intl = useIntl();

	const acheievdLabel = intl.formatMessage({
		id: "acheievdLabel",
		defaultMessage: "Acheievd",
		description: `This text will be show on organization dashboard for acheievd Label`,
	});
	const donorsLabel = intl.formatMessage({
		id: "donorsLabel",
		defaultMessage: "Donors",
		description: `This text will be show on organization dashboard for donors Label`,
	});
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
			{noBarDisplayTitle && noBarDisplayTitle?.length > 0 && dataToDisplay?.length > 0 && (
				<ProgessCardTable
					labels={noBarDisplayTitle}
					rows={dataToDisplay.slice(
						0,
						dataToDisplay.length > 3 ? 3 : dataToDisplay.length
					)}
					useAbbreviateNumber={true}
				/>
			)}

			{!dataToDisplay?.length && (
				<>
					{noBarDisplay && (
						<Box mt={1} mb={1} mr={1}>
							<Typography color="primary" gutterBottom noWrap>
								{donorsLabel}
							</Typography>
						</Box>
					)}
					<Grid item md={12} container justify="center">
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
				</>
			)}

			<Grid style={{ height: "180px" }}>
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
											// norBarDisplayConfig={{
											// 	sum: data.sum ? abbreviateNumber(data.sum) : 0,
											// 	sum_two: data.sum_two
											// 		? abbreviateNumber(data.sum_two)
											// 		: 0,
											// }}
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
																name: acheievdLabel,
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
						{noBarDisplayTitle &&
							noBarDisplayTitle?.length > 0 &&
							dataToDisplay?.length > 0 && (
								<ProgessCardTable labels={noBarDisplayTitle} rows={dataToDisplay} />
							)}
						{dataToDisplay &&
							dataToDisplay.map((data: ProgressCardResponse, index) => {
								return (
									<Box m={1} key={index}>
										<CommonProgres
											key={index}
											title={data.name}
											// norBarDisplayConfig={{
											// 	sum: data.sum ? data.sum : 0,
											// 	sum_two: data.sum_two ? data.sum_two : 0,
											// }}
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
																name: acheievdLabel,
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
