import { IUserDataContext } from "../models/userProvider";

const userReducer = (
	state: IUserDataContext,
	action: { type: string; payload: any }
): IUserDataContext => {
	return state;
};

export default userReducer;
