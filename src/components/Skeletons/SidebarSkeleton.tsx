import { Divider, makeStyles } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

import WorkspaceListSkeleton from "./WorkspaceListSkeleton";

const useStyles = makeStyles({
	root: {
		margin: "4% 0%",
	},
	organisation: {
		margin: "4% 0%",
	},
});

const SidebarSkeleton = () => {
	const classes = useStyles();
	return (
		<>
			<Skeleton
				variant="rect"
				width="100%"
				height={70}
				animation="wave"
				className={classes.organisation}
			></Skeleton>
			<Divider className={classes.root} />

			<WorkspaceListSkeleton />
		</>
	);
};

export default SidebarSkeleton;
