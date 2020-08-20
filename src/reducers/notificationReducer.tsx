import { INotificationContext } from "../models/index";

interface Action {
	type: "CREATE_ERROR" | "CREATE_SUCCESS" | "CLEAR_NOTIFICATION";
	payload?: any;
}

/**
 * Handles user state
 * @param state
 * @param action
 */
const notificationReducer = (state: INotificationContext, action: Action) => {
	switch (action.type) {
		case "CREATE_ERROR":
			return {
				...state,
				errorNotification: action.payload,
			};
		case "CREATE_SUCCESS":
			return {
				...state,
				successNotification: action.payload,
			};
		case "CLEAR_NOTIFICATION":
			return { successNotification: "", errorNotification: "" };
	}
	return state;
};

export const setSuccessNotification = (data: string): Action => {
	return {
		type: "CREATE_SUCCESS",
		payload: data,
	};
};
export const setErrorNotification = (data: string): Action => {
	return {
		type: "CREATE_ERROR",
		payload: data,
	};
};
export const clearNotification = (): Action => {
	return {
		type: "CLEAR_NOTIFICATION",
	};
};

export default notificationReducer;
