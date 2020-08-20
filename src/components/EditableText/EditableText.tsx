import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@material-ui/core";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import { makeStyles, Theme } from "@material-ui/core/styles";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		margin: theme.spacing(2),
		marginLeft: theme.spacing(1),
		"& :hover": {
			"& $EditIcon": {
				opacity: 1,
			},
		},
	},
	textValue: {
		padding: theme.spacing(1),
	},
	EditIcon: {
		opacity: 0,
	},
}));

export default function EditableText({
	textValue,
	handleSubmit,
}: {
	textValue: string;
	handleSubmit: Function;
}) {
	const classes = useStyles();
	const [text, setText] = useState<string>(textValue);
	const [openInput, setOpenInput] = useState<boolean>(false);

	const handleOpenInput = () => {
		setText(textValue);
		setOpenInput(!openInput);
	};
	const handleTextField = (event: any) => {
		setText(event.target.value);
	};
	const handleMySubmit = () => {
		if (!text) {
			handleOpenInput();
			return;
		}
		handleSubmit(text);
		handleOpenInput();
	};
	return (
		<Box className={classes.root}>
			{!openInput && (
				<Box display="flex">
					{textValue && (
						<Box className={classes.textValue}>
							<Typography variant="h5">{textValue}</Typography>
						</Box>
					)}
					<Box className={classes.EditIcon}>
						<IconButton onClick={handleOpenInput} data-testid="editable-edit">
							<EditOutlinedIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			)}
			{openInput && (
				<form>
					<Box display="flex">
						<Box ml={1} mr={1}>
							<TextField
								id="outlined-basic"
								label="Enter Name"
								value={text}
								onChange={handleTextField}
								inputProps={{
									"data-testid": "editable-input",
								}}
							/>
						</Box>
						<Box display="flex">
							<IconButton
								onClick={handleMySubmit}
								style={{ backgroundColor: "transparent" }}
								data-testid="editable-save"
							>
								<DoneIcon />
							</IconButton>
							<IconButton
								onClick={handleOpenInput}
								style={{ backgroundColor: "transparent" }}
								data-testid="editable-cancel"
							>
								<CloseIcon />
							</IconButton>
						</Box>
					</Box>
				</form>
			)}
		</Box>
	);
}
