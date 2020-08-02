import React from "react";
import { Box, Typography, Divider, List } from "@material-ui/core";
import { useStyles } from "../styles";
import { useQuery } from "@apollo/client";
import { GET_ORGANISATIONS } from "../../../graphql/queries";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import IconButton from "@material-ui/core/IconButton";
import WorkspaceList from "./WorkspaceList/WorkspaceList";
import SimpleMenu from "../../Menu/Menu";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function SideBar({ children }: { children: Function }) {
	const classes = useStyles();
	const { loading, error, data } = useQuery(GET_ORGANISATIONS);
	React.useEffect(() => {
		if (data) console.log(data);
	}, [data]);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const menuList = [
		{ children: <IconButton size="small">Edit Orgnisation</IconButton> },
		{ children: <IconButton size="small">Add Workspace</IconButton> },
	];
	return (
		<Box className={classes.sidePanel} mr={1} p={0} boxShadow={1}>
			{loading ? (
				<Box mt={6}>
					<LinearProgress style={{ marginBottom: "3px" }} />
					<LinearProgress color="secondary" />
				</Box>
			) : (
				<div>
					<Box display="flex" m={2}>
						<Box flexGrow={1} ml={1}>
							{
								<Typography color="primary" gutterBottom variant="h6">
									{data.organisationList[0].name}
								</Typography>
							}
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

					{data && data.organisationList[0].id && (
						<WorkspaceList organisation={data.organisationList[0].id} />
					)}
					<List></List>
				</div>
			)}
		</Box>
	);
}
