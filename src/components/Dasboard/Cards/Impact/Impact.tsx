import { Box } from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		height: "100vh",
	},
	alertmsg: {
		marginTop: theme.spacing(2),
	},
}));

const impacts = [
	"Lorem ipsum dolor sit amet,",
	"Lorem ipsum dolor sit amet,",
	"Lorem ipsum dolor sit amet,",
];
export default function Impact() {
	const classes = useStyles();
	return (
		<Box className={classes.root}>
			{/* {impacts.map((impact, index) => {
				return (
					<Typography variant="subtitle1" gutterBottom key={index}>
						{`#${index + 1} ${impact}`}
					</Typography>
				);
			})}*/}
		</Box>
	);
}
