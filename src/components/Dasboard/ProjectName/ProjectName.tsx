import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PROJECT, UPDATE_PROJECT } from "../../../graphql/queries/project";
import { IProject } from "../../../models/project/project";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		margin: theme.spacing(2),
		marginLeft: theme.spacing(1),
		"& :hover": {
			"& $projectEditIcon": {
				opacity: 1,
			},
		},
	},
	project: {
		padding: theme.spacing(1),
		"& :hover": {
			"& $projectEditIcon": {
				opacity: 1,
			},
		},
	},
	projectEditIcon: {
		opacity: 0,
	},
	formButtons: {
		margin: theme.spacing(1),
		marginLeft: theme.spacing(0),
		padding: theme.spacing(0),
		paddingRight: theme.spacing(2),
		paddingLeft: theme.spacing(2),
		color: theme.palette.common.white,
	},
}));

export default function ProjectName() {
	const [getProject, { loading, error, data }] = useLazyQuery(GET_PROJECT);

	const [updateProject] = useMutation(UPDATE_PROJECT);

	const classes = useStyles();
	const [project, setProject] = useState<IProject>({
		name: "",
	});
	const [openInput, setOpenInput] = useState<boolean>(false);
	const [projectId, setProjectId] = useState<number>(0);

	useEffect(() => {
		getProject();
	}, []);

	useEffect(() => {
		if (data && data.orgProject) {
			setProject({
				name: data.orgProject[0].name,
				short_name: data.orgProject[0].short_name,
				description: data.orgProject[0].description,
			});
			setProjectId(data.orgProject[0].id);
		}
	}, [data]);

	const handleOpenInput = () => {
		setOpenInput(!openInput);
	};
	const handleProjectField = (event: any) => {
		setProject({ ...project, name: event.target.value });
		console.log(project);
	};
	const handleSubmit = async () => {
		if (!project.name) {
			return;
		}
		await updateProject({ variables: { id: projectId, input: project } });
		handleOpenInput();
		getProject();
	};
	return (
		<Box className={classes.root}>
			{project && !openInput && (
				<Box display="flex">
					<Box className={classes.project}>
						<Typography variant="h5">{project.name}</Typography>
					</Box>
					<Box className={classes.projectEditIcon}>
						<IconButton onClick={handleOpenInput}>
							<EditOutlinedIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			)}
			{project && openInput && (
				<form>
					<Box display="flex">
						<Box ml={1} mr={1}>
							<TextField
								id="outlined-basic"
								label="Project Name"
								value={project.name}
								onChange={handleProjectField}
							/>
						</Box>
						<Box display="flex">
							<Button
								variant="contained"
								color="primary"
								className={classes.formButtons}
								onClick={handleSubmit}
							>
								Save
							</Button>
							<Button
								variant="contained"
								color="secondary"
								onClick={handleOpenInput}
								className={classes.formButtons}
							>
								Cancel
							</Button>
						</Box>
					</Box>
				</form>
			)}
		</Box>
	);
}
