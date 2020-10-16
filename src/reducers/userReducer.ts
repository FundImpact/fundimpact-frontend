import { IUserDataContext } from "../models/userProvider";

export interface Action {
	type: "SET_USER" | "LOGOUT_USER";
	payload?: any;
}

export const setUser = (payload: IUserDataContext): Action => {
	return { type: "SET_USER", payload };
};

/**
 * Handles user state
 * @param state
 * @param action
 */
const userReducer = (state: IUserDataContext, action: Action) => {
	if (action.type === "LOGOUT_USER") {
		localStorage.removeItem("user");
		window.location.reload();
		if (action.payload?.logoutMsg)
			localStorage.setItem("user", JSON.stringify({ logoutMsg: action.payload?.logoutMsg }));
	}
	if (action.type === "SET_USER") {
		localStorage.setItem(
			"user",
			JSON.stringify({ ...state, ...action.payload, logoutMsg: null })
		);
		return { ...state, ...action.payload };
	}
	return state;
};

export default userReducer;
