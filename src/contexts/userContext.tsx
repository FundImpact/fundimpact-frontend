import React, { createContext } from "react";
import userReducer from "../reducers/userReducer";
import { IUserDataContext } from "../models/userProvider";

const defaultUserState: IUserDataContext = {};

const UserDataContext = createContext<IUserDataContext | undefined>(undefined);
const UserDispatchContext = createContext(userReducer);

UserDataContext.displayName = "UserData";
UserDispatchContext.displayName = "UserDispatcher";

interface IUserProviderProps {
	children: React.ReactNode;
}

function UserProvider({ children }: IUserProviderProps) {
	return (
		<UserDataContext.Provider value={defaultUserState}>
			<UserDispatchContext.Provider value={userReducer}>
				{children}
			</UserDispatchContext.Provider>
		</UserDataContext.Provider>
	);
}

export { UserProvider };
