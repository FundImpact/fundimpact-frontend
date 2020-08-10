import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Slide from "@material-ui/core/Slide";
import { Grid, ClickAwayListener } from "@material-ui/core";
import SlidingButton from "./SlidingButton";

interface CreateButton {
	text: string;
	dialog?: ({
		open,
		handleClose,
	}: {
		open: boolean;
		handleClose: () => void;
	}) => React.ReactNode | void;
}

function AddButton({ createButtons }: { createButtons: CreateButton[] }) {
	const [openSlider, setOpenSlider] = useState<boolean>(false);

	return (
		<>
			<ClickAwayListener onClickAway={() => setOpenSlider(false)}>
				<Fab
					style={{ position: "fixed", right: "0px", bottom: "10px" }}
					data-testid="add-button"
					color="primary"
					aria-label="add"
					onClick={() => {
						setOpenSlider((open) => !open);
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
						right: "0px",
						bottom: "77px",
					}}
					container
					direction="column"
					alignItems="flex-end"
				>
					{createButtons.map((createButton, index) => {
						return (
							<SlidingButton
								dialog={createButton.dialog}
								key={index}
							>
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
