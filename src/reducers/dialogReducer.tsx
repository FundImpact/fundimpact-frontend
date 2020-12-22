import { IDialogContext, INotificationContext } from "../models/index";

interface Action {
	type: "OPEN_DIALOG" | "CLOSE_DIALOG";
	payload?: any;
}

/**
 * Handles user state
 * @param state
 * @param action
 */
const dialogReducer = (state: IDialogContext, action: Action) => {
	switch (action.type) {
		case "OPEN_DIALOG":
			return {
				...state,
				component: action.payload,
			};
		case "CLOSE_DIALOG":
			console.log("here", "CLOSE_DIALOG");
			return {
				component: undefined,
			};
	}
	return state;
};

export const setOpenDialog = (data: React.ReactNode): Action => {
	return {
		type: "OPEN_DIALOG",
		payload: data,
	};
};
export const setCloseDialog = (): Action => {
	return {
		type: "CLOSE_DIALOG",
	};
};

export default dialogReducer;
