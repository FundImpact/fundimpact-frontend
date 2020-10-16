import React from "react";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import { IAlertMsg } from "../../models/index";
import FIAlert from "../AlertMessage/AlertMessage";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { clearNotification } from "../../reducers/notificationReducer";

interface State extends SnackbarOrigin {
	open: boolean;
}

export default function PositionedSnackbar({ severity = "error", msg }: IAlertMsg) {
	const dispatch = useNotificationDispatch();
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
			autoHideDuration={3000}
			onClose={() => {
				dispatch(clearNotification());
				handleClose();
			}}
			key={vertical + horizontal}
			data-testid="fi-snackbar"
		>
			<div>
				<FIAlert severity={severity} msg={msg} />
			</div>
		</Snackbar>
	);
}
