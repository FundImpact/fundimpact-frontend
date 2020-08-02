import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";

export default function DashboardCard({
	title,
	Children,
}: {
	title: string | React.ReactElement;
	Children?: React.ReactElement | any;
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
				{Children && <Children />}
			</CardContent>
		</Card>
	);
}
