import React from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { IAlertMsg } from "../models/index";

function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(2),
		},
	},
	alertmsg: {
		marginTop: theme.spacing(2),
	},
}));

export default function AlertMsg({ severity = "error", msg }: IAlertMsg) {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Alert severity={severity} className={classes.alertmsg}>
				{msg}
			</Alert>
		</div>
	);
}
