import React from "react";
import { Grid, Theme, Typography, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles((theme: Theme) => ({
	uploadBox: {
		backgroundColor: theme.palette.grey[300],
		textAlign: "center",
		height: (props: { height?: string }) => props.height,
	},
}));

function UploadFiles({ title, ...props }: { title: string; height?: string }) {
	const classes = useStyles(props);

	return (
		<Grid container className={classes.uploadBox} alignItems="center">
			<Grid item xs={12}>
				<AddCircleOutlineIcon fontSize="large" />
				<Typography align="center" variant="h5">
					{title}
				</Typography>
			</Grid>
		</Grid>
	);
}

export default UploadFiles;
