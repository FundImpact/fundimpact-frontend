import React, { useState } from "react";
import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	RadioGroup,
	Radio,
	Dialog,
	DialogTitle,
	DialogContent,
	IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import FIDialog from "../../../components/Dialog/Dialog";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyle = makeStyles((theme: Theme) =>
	createStyles({
		ddd: {
			display: "flex",
			justifyContent: "space-between",
			padding: "0px",
			marginTop: "1px",
		},
		title: {
			backgroundColor: "yellow",
		},
	})
);

const TallyContainer = () => {
	const classes = useStyle();
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	return (
		<Box p={2}>
			<h1>Welcome to Tally</h1>
			<Button onClick={() => setOpenDialog(true)} variant="contained">
				Open Dialogue
			</Button>

			<Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
				<Box className={classes.ddd}>
					<DialogTitle>Title</DialogTitle>
					<IconButton
						aria-label="close"
						onClick={handleCloseDialog}
						style={{ backgroundColor: "transparent" }}
					>
						<CloseIcon />
					</IconButton>
				</Box>
				<DialogContent>hi</DialogContent>
			</Dialog>
			{/* <FIDialog open={openDialog} handleClose={handleCloseDialog} header="Cost Center Name">
				<FormControl component="fieldset">
					<RadioGroup row aria-label="tally" name="row-radio-buttons-group">
						<FormControlLabel value="donor" control={<Radio />} label="Donor" />
						<FormControlLabel value="project" control={<Radio />} label="Project" />
						<FormControlLabel value="target" control={<Radio />} label="Target" />
						<FormControlLabel
							value="budget_category"
							control={<Radio />}
							label="Budget Category"
						/>
					</RadioGroup>
				</FormControl>
			</FIDialog> */}
		</Box>
	);
};

export default TallyContainer;
