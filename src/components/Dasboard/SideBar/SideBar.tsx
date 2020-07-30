import React from "react";
import { Box, Typography, Divider } from "@material-ui/core";
import { useStyles } from "../styles";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ORGANISATIONS, GET_WORKSPACES_BY_ORG } from "../../../graphql/queries";
import { Skeleton } from "@material-ui/lab";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import IconButton from "@material-ui/core/IconButton";
import WorkspaceList from "./WorkspaceList/WorkspaceList";
import SimpleMenu from "../../Menu/Menu";
import "./sidebar.css";

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
		if (workSpaces) console.log(workSpaces);
	}, [data, workSpaces]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const menuList = [
		{ listName: "Edit Organisation", Children: null },
		{ listName: "Add Workspace", Children: null },
	];
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			{loading ? (
				<Skeleton variant="text" />
			) : (
				<div>
					<Box display="flex" m={2}>
						<Box flexGrow={1} ml={1}>
							<Typography color="primary" gutterBottom variant="h6">
								Organisation Name
							</Typography>
						</Box>
						<Box>
							<IconButton
								edge="end"
								aria-label="edit"
								aria-controls={`organisationMenu`}
								aria-haspopup="true"
								onClick={handleClick}
							>
								<MoreVertOutlinedIcon />
							</IconButton>
							<SimpleMenu
								handleClose={handleClose}
								id={`organisationMenu`}
								anchorEl={anchorEl}
								menuList={menuList}
							/>
						</Box>
					</Box>
					<Divider />
					<WorkspaceList />
				</div>
			)}
		</Box>
	);
}
