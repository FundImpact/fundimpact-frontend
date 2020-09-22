import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Slide from "@material-ui/core/Slide";
import { Grid, ClickAwayListener } from "@material-ui/core";
import SlidingButton from "./SlidingButton";
import { CreateButton } from "../../../models/addButton";
import { FormattedMessage } from "react-intl";

function AddButton({
	createButtons,
	buttonAction,
}: {
	createButtons: CreateButton[];
	buttonAction?: {
		dialog: ({
			open,
			handleClose,
		}: {
			open: boolean;
			handleClose: () => void;
		}) => React.ReactNode | void;
	};
}) {
	const [openSlider, setOpenSlider] = useState<boolean>(false);
	const [openDialog, setOpenDialog] = useState<boolean>(false);

	return (
		<>
			{buttonAction?.dialog({
				open: openDialog,
				handleClose: () => {
					setOpenDialog(false);
				},
			})}

			<ClickAwayListener onClickAway={() => setOpenSlider(false)}>
				<Fab
					style={{ position: "fixed", right: "10px", bottom: "10px" }}
					data-testid="add-button"
					color="primary"
					aria-label="add"
					onClick={() => {
						setOpenSlider((open) => !open);
						buttonAction && setOpenDialog(true);
					}}
					disableRipple
				>
					<AddIcon />
				</Fab>
			</ClickAwayListener>
			<Slide data-testid="sliding-buttons" direction="up" in={openSlider}>
				<Grid
					style={{
						position: "fixed",
						right: "10px",
						bottom: "77px",
					}}
					container
					direction="column"
					alignItems="flex-end"
				>
					{createButtons.map((createButton, index) => {
						return (
							<SlidingButton dialog={createButton.dialog} key={index}>
								{/*if createButton.text is Create Budget Category then id will be createbudgetcategoryButton */}
								{createButton.text}
							</SlidingButton>
						);
					})}
				</Grid>
			</Slide>
		</>
	);
}

export default AddButton;
