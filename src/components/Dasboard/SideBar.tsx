import React from "react";
import { Box } from "@material-ui/core";
import { useStyles } from "./styles";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORGANISATIONS, GET_WORKSPACES_BY_ORG } from "../../graphql/queries";
import { Skeleton } from "@material-ui/lab";

export default function SideBar({ children }: { children: Function }) {
	const classes = useStyles();
	const { loading, error, data } = useQuery(GET_ORGANISATIONS);
	const [getWorkSpaces, { loading: workSpaceLoading, data: workSpaces }] = useLazyQuery(
		GET_WORKSPACES_BY_ORG
	);
	React.useEffect(() => {
		if (data) {
			getWorkSpaces({
				variables: {
					orgId: 14,
				},
			});
		}
	}, [data]);

	return (
		<Box className={classes.sidePanel} mr={1} p={2}>
			{loading ? (
				<Skeleton variant="text" />
			) : (
				children(data?.organisations[0], workSpaces?.workspaces || [])
			)}
		</Box>
	);
}
