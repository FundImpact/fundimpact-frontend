import { Divider } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React from "react";

import ProjectListSkeleton from "./projectList";

const ICustomSkeleton = () => (
	<>
		{/* Workspace Heading Row */}
		<Skeleton variant="rect" width="100%" height={40} animation="wave"></Skeleton>
		{/* Projects  */}
		<ProjectListSkeleton />
		<Divider />
	</>
);

const WorkspaceListSkeleton = () => {
	/**
	 * The values/content of the array is used only for key assigment. The length of array
	 * denote how many workspace skeleton will be created.
	 */
	return (
		<>
			{["1", "2", "3"].map((row) => (
				<ICustomSkeleton key={row} />
			))}
		</>
	);
};

export default WorkspaceListSkeleton;
