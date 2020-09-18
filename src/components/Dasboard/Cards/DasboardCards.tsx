import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { FormattedMessage } from "react-intl";

export default function DashboardCard({
	title = "",
	children,
}: {
	title: string | React.ReactElement;
	children?: React.ReactElement | any;
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
					{/*title is FUND STATUS then id will be fundstatusCard */}
					<FormattedMessage
						id={`${title.toString().replace(/ /g, "").toLowerCase()}Card`}
						defaultMessage={`${title}`}
						description={`This text will be shown on Dashboard ${title} Card`}
					/>
				</Typography>
				{children}
			</CardContent>
		</Card>
	);
}
