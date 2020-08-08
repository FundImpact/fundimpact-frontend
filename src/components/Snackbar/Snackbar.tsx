import React from "react";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { IAlertMsg } from "../../models/index";
import FIAlert from "../AlertMessage/AlertMessage";

interface State extends SnackbarOrigin {
	open: boolean;
}

export default function PositionedSnackbar({ severity = "error", msg }: IAlertMsg) {
	const [state, setState] = React.useState<State>({
		open: true,
		vertical: "top",
		horizontal: "right",
	});
	const { vertical, horizontal, open } = state;
	const handleClose = () => {
		setState({ ...state, open: false });
	};

	return (
		<Snackbar
			anchorOrigin={{ vertical, horizontal }}
			open={open}
			autoHideDuration={6000}
			onClose={handleClose}
			key={vertical + horizontal}
			data-testid="fi-snackbar"
		>
			<div>
				<FIAlert severity={severity} msg={msg} />
			</div>
		</Snackbar>
	);
}
