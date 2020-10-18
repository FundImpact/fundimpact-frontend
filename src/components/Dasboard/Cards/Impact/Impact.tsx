import { useQuery } from "@apollo/client";
import { Avatar, Badge, Box, Grid, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { GET_IMPACT_TARGET_SDG_COUNT } from "../../../../graphql/project";

export default function Impact() {
	const dashboardData = useDashBoardData();
	const { data, loading } = useQuery(GET_IMPACT_TARGET_SDG_COUNT, {
		variables: {
			filter: { organization: dashboardData?.project?.id },
		},
	});
	if (loading) {
		return (
			<>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
				<Skeleton variant="text" animation="wave"></Skeleton>
			</>
		);
	}
	return (
		<Grid container spacing={2}>
			{data?.impactTargetSdgCount.length === 0 && (
				<Grid item md={12} justify="center" container>
					<Box mt={2} color="text.disabled">
						<Typography variant="subtitle2" noWrap>
							<FormattedMessage
								id={`noImpactFound`}
								defaultMessage={`No Impact Found`}
								description={`This text will be shown if no category found for dashboard impact card`}
							/>
						</Typography>
					</Box>
				</Grid>
			)}
			{data?.impactTargetSdgCount?.map(
				(sdg: { id: string; name: string; count: string; icon: string }) => {
					return (
						<Grid item>
							<Badge badgeContent={sdg?.count} color="primary">
								<Avatar alt="SD" src={sdg?.icon}>
									{sdg?.name}
								</Avatar>
							</Badge>
						</Grid>
					);
				}
			)}
		</Grid>
	);
}
