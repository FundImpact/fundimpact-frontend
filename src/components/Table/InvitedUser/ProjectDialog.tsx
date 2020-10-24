import React from "react";
import {
	Dialog,
	Typography,
	Box,
	List,
	ListItem,
	ListItemText,
	makeStyles,
	createStyles,
	Theme,
	useTheme,
} from "@material-ui/core";
import { DefaultTheme } from "@material-ui/styles";

function ProjectDialog({
	open,
	handleClose,
	projects,
}: {
	open: boolean;
	handleClose: () => void;
	projects: { project: { id: string; name: string; workspace: { id: string; name: string } } }[];
}) {
	const theme = useTheme();

	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={handleClose}
			data-testid="project-dialog"
			aria-labelledby="form-dialog-title"
		>
			<Box p={2}>
				{!projects.length ? (
					<Typography variant="h5" align="center">
						No Project Assigned
					</Typography>
				) : (
					<>
						<Typography variant="h5" gutterBottom>
							Project Assigned
						</Typography>
						<List>
							{projects.map(({ project }, index) => (
								<ListItem
									key={index}
									style={{
										background:
											index % 2 == 0
												? theme.palette.action.hover
												: theme.palette.background.paper,
									}}
								>
									<ListItemText>{project.name}</ListItemText>
								</ListItem>
							))}
						</List>
					</>
				)}
			</Box>
		</Dialog>
	);
}

export default ProjectDialog;
