import { IUserDataContext } from "../models/userProvider";

export interface Action {
	type: "SET_USER";
	payload?: any;
}

export const setUser = (payload: IUserDataContext): Action => {
	return { type: "SET_USER", payload };
};

const userReducer = (state: IUserDataContext, action: Action): IUserDataContext => {
	if (action.type === "SET_USER") {
		localStorage.setItem("user", JSON.stringify(action.payload));
		return { ...state, ...action.payload };
	}
	return state;
};

export default userReducer;
