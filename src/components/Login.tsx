import React from "react";
import { Box, Button, createStyles, Paper, TextField, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: "flex",
			flexDirection: "column",
			height: "100%",
			justifyContent: "center",
			"& .MuiTextField-root,": {
				margin: theme.spacing(1),
			},
			"& .MuiButtonBase-root": {
				marginTop: theme.spacing(4),
				marginLeft: theme.spacing(1),
				marginRight: theme.spacing(1),
			},
		},
	})
);

function Login() {
	const classes = useStyles();
	return (
		<Box m="auto" height={"100%"} width={"50%"}>
			<form className={classes.root} autoComplete="off">
				<TextField label="Username" name="userName" variant="outlined" />
				<TextField label="Password" type="password" variant="outlined" />
				<Button variant="contained" color="primary">
					Submit
				</Button>
			</form>
		</Box>
	);
}

export default Login;
