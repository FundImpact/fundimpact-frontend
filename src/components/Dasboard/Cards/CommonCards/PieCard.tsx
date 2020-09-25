import { Grid, Box, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { FormattedMessage } from "react-intl";
import { PieCardConfig } from "../../../../models/cards/cards";
import { PieChart } from "../../../Charts";
import MoreButton from "../MoreIconButton";

export function PieCard(pieCardConfig: PieCardConfig) {
	const { pieData, moreButtonLink, loading } = pieCardConfig;
	if (loading) {
		return (
			<Grid item md={12}>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
			</Grid>
		);
	}
	return (
		<>
			{!pieData.datasets[0]?.data?.length ? (
				<Grid item md={12} justify="center" container>
					<Box mt={2}>
						<Typography variant="subtitle2" noWrap>
							<FormattedMessage
								id={`noCategoryFound`}
								defaultMessage={`No Category Found`}
								description={`This text will be shown if no category found for organization dashboard category card`}
							/>
						</Typography>
					</Box>
				</Grid>
			) : (
				<>
					<Grid item md={12}>
						<Box p={1}>
							<PieChart data={pieData} />
						</Box>
					</Grid>
					<Grid item md={12} justify="flex-end" container>
						{moreButtonLink && <MoreButton link={moreButtonLink} />}
					</Grid>
				</>
			)}
		</>
	);
}
