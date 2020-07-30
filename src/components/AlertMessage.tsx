import { makeStyles, Theme, useTheme } from "@material-ui/core/styles";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";

import { IAlertMsg } from "../models";

function Alert(props: AlertProps) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
	alertmsg: {
		marginTop: theme.spacing(4),
	},
}));

export default function AlertMsg({ severity = "error", msg }: IAlertMsg) {
	const classes = useStyles();
	const theme = useTheme();
	return (
		<Alert severity={severity} className={classes.alertmsg}>
			{msg}
		</Alert>
	);
}
