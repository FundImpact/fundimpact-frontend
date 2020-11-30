import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { ListItem, List, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
	root: {
		paddingTop: "1px",
		paddingBottom: "1px",
	},
});

function TableSkeleton({
	lines = 6,
	headerHeight = 40,
}: {
	lines?: number;
	headerHeight?: number;
}) {
	const classes = useStyles();
	return (
		<div>
			<List component="nav" aria-label="main mailbox folders">
				<ListItem className={classes.root}>
					<ListItemText>
						<Skeleton
							variant="rect"
							width="100%"
							height={headerHeight}
							animation="wave"
						></Skeleton>
					</ListItemText>
				</ListItem>

				{Array.from({ length: lines }).map((element, index) => (
					<ListItem className={classes.root} key={index}>
						<ListItemText>
							<Skeleton variant="text" animation="wave"></Skeleton>
						</ListItemText>
					</ListItem>
				))}
			</List>
		</div>
	);
}

export default TableSkeleton;
