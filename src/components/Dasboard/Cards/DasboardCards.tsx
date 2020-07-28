import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import FundStatus from "./FundStatus/FundStatus";
import Achievement from "./Achievement/Achievement";
import Impact from "./Impact/Impact";

export default function DashboardCard({
	title,
	children,
}: {
	title: string | React.ReactElement;
	children?: React.ReactElement;
}) {
	const useStyles = makeStyles((theme: Theme) => ({
		root: {
			width: "100%",
			"& > * + *": {
				marginTop: theme.spacing(2),
			},
		},
		card: {
			height: "90%",
			maxHeight: "12rem",
			margin: theme.spacing(1),
			marginTop: theme.spacing(0),
		},
	}));

	const classes = useStyles();

	return (
		<Card raised={false} className={classes.card}>
			<CardContent>
				<Typography color="primary" gutterBottom>
					{title}
				</Typography>
				{title === "FUND STATUS" && <FundStatus />}
				{title === "ACHIEVEMENTS" && <Achievement />}
				{title === "IMPACT" && <Impact />}
			</CardContent>
		</Card>
	);
}
