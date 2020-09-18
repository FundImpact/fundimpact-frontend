import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage, useIntl } from "react-intl";

export default function DashboardCard({
	title = "",
	children,
	cardHeight = "24vh",
}: {
	title: string | React.ReactElement;
	children?: React.ReactElement | any;
	cardHeight?: string;
}) {
	const intl = useIntl();
	const useStyles = makeStyles((theme: Theme) => ({
		root: {
			width: "100%",
			"& > * + *": {
				marginTop: theme.spacing(2),
			},
		},
		card: {
			margin: theme.spacing(1),
			marginTop: theme.spacing(0),
		},
	}));

	const classes = useStyles();
	return (
		<Card raised={false} className={classes.card} style={{ height: cardHeight }}>
			<CardContent>
				<Typography color="primary" gutterBottom>
					{title}
				</Typography>
				{children}
			</CardContent>
		</Card>
	);
}
