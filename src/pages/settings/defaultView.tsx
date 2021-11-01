import { Grid, makeStyles, Theme } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		color: "gray",
		fontSize: "3vw",
		opacity: 0.2,
		// background: "red",
		marginTop: "40%",
		transform: "translateY(-100%)",
	},
}));
const IDefaultView = () => {
	const classes = useStyles();
	return (
		<Grid
			className={classes.root}
			container
			direction="column"
			justify="center"
			alignItems="center"
			alignContent="center"
		>
			<h1>SETTINGS</h1>
		</Grid>
	);
};

export default IDefaultView;
