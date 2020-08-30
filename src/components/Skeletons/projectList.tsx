import { List, ListItem, ListItemText, makeStyles } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

const useStyles = makeStyles({
	root: {
		paddingTop: "1px",
		paddingBottom: "1px",
	},
});

const ProjectListSkeleton = () => {
	const classes = useStyles();

	return (
		<>
			<List component="nav" aria-label="main mailbox folders">
				<ListItem className={classes.root}>
					<ListItemText>
						<Skeleton variant="text" animation="wave" width="60%"></Skeleton>
					</ListItemText>
				</ListItem>
				<ListItem className={classes.root}>
					<ListItemText>
						<Skeleton variant="text" animation="wave"></Skeleton>
					</ListItemText>
				</ListItem>
				<ListItem className={classes.root}>
					<ListItemText>
						<Skeleton variant="text" animation="wave"></Skeleton>
					</ListItemText>
				</ListItem>
				<ListItem className={classes.root}>
					<ListItemText>
						<Skeleton variant="text" animation="wave" width="60%"></Skeleton>
					</ListItemText>
				</ListItem>
			</List>
		</>
	);
};

export default ProjectListSkeleton;
