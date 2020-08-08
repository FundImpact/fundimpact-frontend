import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Slide from "@material-ui/core/Slide";
import { Grid } from "@material-ui/core";
import SlidingButton from "./SlidingButton";

interface CreateButton {
	text: string;
}

function AddButton({ createButtons }: { createButtons: CreateButton[] }) {
	const [openSlider, setOpenSlider] = useState<boolean>(false);

	return (
		<>
			<Fab
				style={{ position: "fixed", right: "0px", bottom: "10px" }}
				color="primary"
				aria-label="add"
				onClick={() => {
					setOpenSlider(true);
				}}
				disableRipple
			>
				<AddIcon />
			</Fab>
			<Slide direction="up" in={openSlider} mountOnEnter unmountOnExit>
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
							<SlidingButton key={index} onClickAway={() => setOpenSlider(false)}>
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
