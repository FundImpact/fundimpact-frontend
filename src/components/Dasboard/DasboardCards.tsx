import React from "react";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import { useStyles } from "./styles";

export default function DashboardCard({
	title,
	children,
}: {
	title: string | React.ReactElement;
	children?: React.ReactElement;
}) {
	const classes = useStyles();

	return (
		<Card raised={false} className={classes.card}>
			<CardContent>
				<Typography color="primary" gutterBottom>
					{title}
				</Typography>
			</CardContent>
		</Card>
	);
}
