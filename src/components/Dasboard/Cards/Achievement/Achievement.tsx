import { useLazyQuery } from "@apollo/client";
import { Box, Typography } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createStyles, makeStyles, Theme, withStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";

import { useDashBoardData } from "../../../../contexts/dashboardContext";
import { GET_ALL_IMPACT_TARGET_AMOUNT } from "../../../../graphql/Impact/query";
import {
	GET_ALL_DELIVERABLES_SPEND_AMOUNT,
	GET_ALL_DELIVERABLES_TARGET_AMOUNT,
} from "../../../../graphql/project";

const useStyles = makeStyles((theme: Theme) => ({
	root: { height: "100vh" },
}));

const BorderLinearProgress = withStyles((theme: Theme) =>
	createStyles({
		root: {
			height: 10,
			borderRadius: 5,
			margin: theme.spacing(0, 1, 0, 1),
		},
		colorPrimary: {
			backgroundColor: theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
		},
	})
)(LinearProgress);

interface IIndicatorProps_PROPS {
	name: string;
	percentage?: number;
	lastUpdated: string;
	color: "primary" | "secondary" | undefined;
}

const ISTATUS = (props: IIndicatorProps_PROPS) => {
	if (props.percentage === null || props.percentage === undefined)
		return (
			<>
				<Skeleton variant="text" animation="wave" height="40px"></Skeleton>
			</>
		);
	return (
		<>
			<Box display="flex">
				<Box flexGrow={1} ml={1}>
					<Typography variant="subtitle2" gutterBottom>
						{props.name}
					</Typography>
				</Box>
				<Box mr={1} color="text.disabled">
					<Typography variant="body2" gutterBottom>
						{`Updated at ${props.lastUpdated}`}
					</Typography>
				</Box>
			</Box>
			<BorderLinearProgress
				variant="determinate"
				value={props.percentage}
				color={props.color}
			/>
		</>
	);
};

export default function Achievement() {
	const dashboardData = useDashBoardData();
	const projectId = dashboardData?.project?.id;
	let [GetDeliverableAmountTarget, { data: DeliverableAmountTarget }] = useLazyQuery(
		GET_ALL_DELIVERABLES_TARGET_AMOUNT
	);
	let [GetDeliverableAmountSpend, { data: DeliverableAmountSpend }] = useLazyQuery(
		GET_ALL_DELIVERABLES_SPEND_AMOUNT
	);

	let [GetImpactAmountTarget, { data: ImpactAmountTarget }] = useLazyQuery(
		GET_ALL_IMPACT_TARGET_AMOUNT
	);

	let [GetImpactAmountSpend, { data: ImpactAmountSpend }] = useLazyQuery(
		GET_ALL_DELIVERABLES_SPEND_AMOUNT
	);
	useEffect(() => {
		setDELIVERABLE_STATUS({ ...DELIVERABLE_STATUS, percentage: undefined });
		setIMPACT_STATUS({ ...IMPACT_STATUS, percentage: undefined });
		if (!projectId) return;
		GetDeliverableAmountSpend({ variables: { filter: { project: projectId } } });
		GetDeliverableAmountTarget({ variables: { filter: { project: projectId } } });
		GetImpactAmountTarget({ variables: { filter: { project: projectId } } });
		GetImpactAmountSpend({ variables: { filter: { project: projectId } } });
	}, [projectId]);

	const [DELIVERABLE_STATUS, setDELIVERABLE_STATUS] = useState<IIndicatorProps_PROPS>({
		name: "Deliverables",
		percentage: undefined,
		lastUpdated: "20-5-2020",
		color: "secondary",
	});

	const [IMPACT_STATUS, setIMPACT_STATUS] = useState<IIndicatorProps_PROPS>({
		name: "Impact",
		percentage: undefined,
		lastUpdated: "20-5-2020",
		color: "primary",
	});

	useEffect(() => {
		const TargetAmount = DeliverableAmountTarget
			? DeliverableAmountTarget?.deliverableTargetTotalAmount
			: null;
		const AmoundSpend = DeliverableAmountSpend
			? DeliverableAmountSpend.deliverableTrackingTotalSpendAmount
			: null;
		if (TargetAmount === undefined || TargetAmount === null) return;
		if (AmoundSpend === undefined || AmoundSpend === null) return;

		const totalPercentageSpend = ((AmoundSpend / TargetAmount) * 100).toFixed(2);
		setDELIVERABLE_STATUS({ ...DELIVERABLE_STATUS, percentage: +totalPercentageSpend });
	}, [DeliverableAmountTarget, DeliverableAmountSpend]);

	useEffect(() => {
		const TargetAmount = ImpactAmountTarget
			? ImpactAmountTarget?.impactTargetProjectTotalAmount
			: null;
		const AmoundSpend = ImpactAmountSpend
			? ImpactAmountSpend.deliverableTrackingTotalSpendAmount
			: null;
		if (TargetAmount === undefined || TargetAmount === null) return;
		if (AmoundSpend === undefined || AmoundSpend === null) return;

		const totalPercentageSpend = ((AmoundSpend / TargetAmount) * 100).toFixed(2);
		setIMPACT_STATUS({ ...IMPACT_STATUS, percentage: +totalPercentageSpend });
	}, [ImpactAmountSpend, ImpactAmountTarget]);

	return (
		<>
			<Box m={1}>
				<ISTATUS {...DELIVERABLE_STATUS} />
			</Box>
			<Box m={1}>
				<ISTATUS {...IMPACT_STATUS} />
			</Box>
		</>
	);
}
