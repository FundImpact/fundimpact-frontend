import { useLazyQuery } from "@apollo/client";
import { Box, Grid, Typography } from "@material-ui/core";
// import { makeStyles, Theme } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
import { useDashBoardData } from "../../../../contexts/dashboardContext";
import {
	GET_ALL_DELIVERABLES_SPEND_AMOUNT,
	GET_ALL_DELIVERABLES_TARGET_AMOUNT,
} from "../../../../graphql/project";
import { useIntl } from "react-intl";
import { ChartBullet, ChartThemeColor } from "@patternfly/react-charts";
import { MODULE_CODES, userHasAccess } from "../../../../utils/access";
import { DELIVERABLE_TARGET_ACTIONS } from "../../../../utils/access/modules/deliverableTarget/actions";
import { IMPACT_TARGET_ACTIONS } from "../../../../utils/access/modules/impactTarget/actions";

interface IIndicatorProps_PROPS {
	name: string;
	achieved: number;
	target: number;
	lastUpdated: string;
	color: "primary" | "secondary" | undefined;
	loading?: boolean;
}

const ISTATUS = (props: IIndicatorProps_PROPS) => {
	return (
		<>
			<Grid item xs={3}>
				<Box mt={1}>
					<Typography noWrap>{props.name}</Typography>
				</Box>
			</Grid>
			<Grid item xs={9} style={{ height: "60px", width: "100%" }}>
				<ChartBullet
					ariaTitle={props.name}
					comparativeErrorMeasureData={[{ name: "Target", y: props.target }]}
					labels={({ datum }) => `${datum.name}: ${datum.y}`}
					padding={{
						left: 50, // Adjusted to accommodate labels
						right: 50,
						bottom: 120,
					}}
					primarySegmentedMeasureData={[{ name: "Achieved", y: props.achieved }]}
					height={70}
					themeColor={ChartThemeColor.green}
				/>
			</Grid>
			{/* <Box display="flex">
				<Box flexGrow={1} ml={1}>
					<Typography variant="subtitle2" gutterBottom> */}
			{/*This text is for deliverable and impact headings in achievement card*/}
			{/* <FormattedMessage
							id={`${props.name}AchievementCard`}
							defaultMessage={props.name}
							description={`This text will be shown on Dashboard achievement card for ${props.name}`}
						/>
					</Typography>
				</Box>
				<Box mr={1} color="text.disabled" display="flex">
					<Box mr={1}>
						<Typography variant="body2" gutterBottom>
							<FormattedMessage
								id={`updatedAtAchievementCard`}
								defaultMessage={"Updated at"}
								description={`This text will be shown on Dashboard achievement card for updated at`}
							/>
						</Typography>
					</Box>
					<Typography variant="body2" gutterBottom>
						{`${props.lastUpdated}`}
					</Typography>
				</Box>
			</Box>
			<Box style={{ height: "30px", width: "100%" }}>
			<ChartBullet
				ariaTitle={"title"}
				comparativeErrorMeasureData={[{name: "Target" ,y:100}]}
				labels={({ datum }) => `${datum.name}: ${datum.y}`}
				padding={{
					left: 50, // Adjusted to accommodate labels
					right: 50,
					bottom: 120,
				}}
				primarySegmentedMeasureData={[{ name : "Achieved" , y :props.percentage }]}
				height={100}
				themeColor={ChartThemeColor.green}	
			/>
			</Box> */}

			{/* <BorderLinearProgress
				variant="determinate"
				value={props.percentage}
				color={props.color}
			/> */}
		</>
	);
};

export default function Achievement() {
	const dashboardData = useDashBoardData();
	const projectId = dashboardData?.project?.id;
	const deliverableTargetFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_TARGET,
		DELIVERABLE_TARGET_ACTIONS.FIND_DELIVERABLE_TARGET
	);
	const impactTargetFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.FIND_IMPACT_TARGET
	);
	const outputTargetFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.FIND_IMPACT_TARGET
	);
	const outcomeTargetFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_TARGET,
		IMPACT_TARGET_ACTIONS.FIND_IMPACT_TARGET
	);

	let [GetDeliverableAmountTarget, { data: DeliverableAmountTarget }] = useLazyQuery(
		GET_ALL_DELIVERABLES_TARGET_AMOUNT
	);
	let [GetDeliverableAmountSpend, { data: DeliverableAmountSpend }] = useLazyQuery(
		GET_ALL_DELIVERABLES_SPEND_AMOUNT,
		{
			onCompleted: (data) => {
				// console.log("ddss", data);
			},
		}
	);

	let [GetImpactAmountTarget, { data: ImpactAmountTarget }] = useLazyQuery(
		GET_ALL_DELIVERABLES_TARGET_AMOUNT
	);

	let [GetImpactAmountSpend, { data: ImpactAmountSpend }] = useLazyQuery(
		GET_ALL_DELIVERABLES_SPEND_AMOUNT,
		{
			onCompleted: (data) => {
				// console.log("ddss", data);
			},
		}
	);

	let [GetOutputAmountTarget, { data: OutputAmountTarget }] = useLazyQuery(
		GET_ALL_DELIVERABLES_TARGET_AMOUNT
	);

	let [GetOutputAmountSpend, { data: OutputAmountSpend }] = useLazyQuery(
		GET_ALL_DELIVERABLES_SPEND_AMOUNT,
		{
			onCompleted: (data) => {
				// console.log("output data", data);
			},
		}
	);
	let [GetOutcomeAmountTarget, { data: OutcomeAmountTarget }] = useLazyQuery(
		GET_ALL_DELIVERABLES_TARGET_AMOUNT
	);

	let [GetOutcomeAmountSpend, { data: OutcomeAmountSpend }] = useLazyQuery(
		GET_ALL_DELIVERABLES_SPEND_AMOUNT,
		{
			onCompleted: (data) => {
				// console.log("output data", data);
			},
		}
	);
	useEffect(() => {
		setDELIVERABLE_STATUS({ ...DELIVERABLE_STATUS });
		setIMPACT_STATUS({ ...IMPACT_STATUS });
		setOUTPUT_STATUS({ ...OUTPUT_STATUS });
		setOUTCOME_STATUS({ ...OUTCOME_STATUS });
		if (!projectId) return;
		GetDeliverableAmountSpend({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "deliverable",
					},
				},
			},
		});
		GetDeliverableAmountTarget({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "deliverable",
					},
				},
			},
		});
		GetImpactAmountTarget({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "impact",
					},
				},
			},
		});
		GetImpactAmountSpend({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "impact",
					},
				},
			},
		});
		GetOutputAmountTarget({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "output",
					},
				},
			},
		});
		GetOutputAmountSpend({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "output",
					},
				},
			},
		});
		GetOutcomeAmountTarget({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "outcome",
					},
				},
			},
		});
		GetOutcomeAmountSpend({
			variables: {
				filter: {
					project: projectId,
					deliverable_target_project: {
						type: "outcome",
					},
				},
			},
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [projectId]);

	const intl = useIntl();
	const [DELIVERABLE_STATUS, setDELIVERABLE_STATUS] = useState<IIndicatorProps_PROPS>({
		name: intl.formatMessage({
			id: "deliverableAchievementCard",
			defaultMessage: "Deliverable",
			description: `This text will be show on dashboard achievement card for fund deliverable`,
		}),
		achieved: 0,
		target: 0,
		lastUpdated: "20-5-2020",
		color: "secondary",
	});

	const [IMPACT_STATUS, setIMPACT_STATUS] = useState<IIndicatorProps_PROPS>({
		name: intl.formatMessage({
			id: "impactAchievementCard",
			defaultMessage: "Impact",
			description: `This text will be show on dashboard achievement card for fund deliverable`,
		}),
		achieved: 0,
		target: 0,
		lastUpdated: "20-5-2020",
		color: "primary",
	});

	const [OUTPUT_STATUS, setOUTPUT_STATUS] = useState<IIndicatorProps_PROPS>({
		name: intl.formatMessage({
			id: "outputAchievementCard",
			defaultMessage: "Output",
			description: `This text will be show on dashboard achievement card for fund output`,
		}),
		achieved: 0,
		target: 0,
		lastUpdated: "20-5-2020",
		color: "primary",
	});

	const [OUTCOME_STATUS, setOUTCOME_STATUS] = useState<IIndicatorProps_PROPS>({
		name: intl.formatMessage({
			id: "outcomeAchievementCard",
			defaultMessage: "Outcome",
			description: `This text will be show on dashboard achievement card for fund output`,
		}),
		achieved: 0,
		target: 0,
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

		// const totalPercentageSpend = ((AmoundSpend / TargetAmount) * 100).toFixed(2);
		setDELIVERABLE_STATUS({
			...DELIVERABLE_STATUS,
			achieved: Math.floor((AmoundSpend / TargetAmount) * 100),
			target: TargetAmount ? 100 : 0,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [DeliverableAmountTarget, DeliverableAmountSpend]);

	useEffect(() => {
		const TargetAmount = ImpactAmountTarget
			? ImpactAmountTarget?.deliverableTargetTotalAmount
			: null;
		const AmoundSpend = ImpactAmountSpend
			? ImpactAmountSpend.deliverableTrackingTotalSpendAmount
			: null;
		if (TargetAmount === undefined || TargetAmount === null) return;
		if (AmoundSpend === undefined || AmoundSpend === null) return;
		// const totalPercentageSpend = ((AmoundSpend / TargetAmount) * 100).toFixed(2);
		setIMPACT_STATUS({
			...IMPACT_STATUS,
			achieved: Math.floor((AmoundSpend / TargetAmount) * 100),
			target: TargetAmount ? 100 : 0,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ImpactAmountSpend, ImpactAmountTarget]);

	useEffect(() => {
		const TargetAmount = OutputAmountTarget
			? OutputAmountTarget?.deliverableTargetTotalAmount
			: null;
		const AmoundSpend = OutputAmountSpend
			? OutputAmountSpend.deliverableTrackingTotalSpendAmount
			: null;
		if (TargetAmount === undefined || TargetAmount === null) return;
		if (AmoundSpend === undefined || AmoundSpend === null) return;
		// const totalPercentageSpend = ((AmoundSpend / TargetAmount) * 100).toFixed(2);
		setOUTPUT_STATUS({
			...OUTPUT_STATUS,
			achieved: Math.floor((AmoundSpend / TargetAmount) * 100),
			target: TargetAmount ? 100 : 0,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [OutputAmountSpend, OutputAmountTarget]);

	useEffect(() => {
		const TargetAmount = OutcomeAmountTarget
			? OutcomeAmountTarget?.deliverableTargetTotalAmount
			: null;
		const AmoundSpend = OutcomeAmountSpend
			? OutcomeAmountSpend.deliverableTrackingTotalSpendAmount
			: null;
		if (TargetAmount === undefined || TargetAmount === null) return;
		if (AmoundSpend === undefined || AmoundSpend === null) return;
		// const totalPercentageSpend = ((AmoundSpend / TargetAmount) * 100).toFixed(2);
		setOUTCOME_STATUS({
			...OUTCOME_STATUS,
			achieved: Math.floor((AmoundSpend / TargetAmount) * 100),
			target: TargetAmount ? 100 : 0,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [OutcomeAmountSpend, OutcomeAmountTarget]);

	if (
		!DeliverableAmountTarget ||
		!DeliverableAmountSpend ||
		!ImpactAmountTarget ||
		!ImpactAmountSpend ||
		!OutputAmountTarget ||
		!OutputAmountSpend ||
		!OutcomeAmountTarget ||
		!OutcomeAmountSpend
	)
		return (
			<Grid item xs={12}>
				<Skeleton variant="text" animation="wave" height="40px"></Skeleton>
				<Skeleton variant="text" animation="wave" height="40px"></Skeleton>
			</Grid>
		);

	return (
		<Grid container>
			<Grid item md={6}>
				<Grid container>
					{deliverableTargetFindAccess && <ISTATUS {...DELIVERABLE_STATUS} />}
				</Grid>
				<Grid container>{impactTargetFindAccess && <ISTATUS {...IMPACT_STATUS} />}</Grid>
			</Grid>
			<Grid item md={6}>
				<Grid container>{outputTargetFindAccess && <ISTATUS {...OUTPUT_STATUS} />}</Grid>
				<Grid container>{outcomeTargetFindAccess && <ISTATUS {...OUTCOME_STATUS} />}</Grid>
			</Grid>
		</Grid>
	);
}
