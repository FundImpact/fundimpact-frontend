import React, { createContext, Dispatch } from "react";
import userReducer, { Action } from "../reducers/userReducer";
import { IUserDataContext } from "../models/userProvider";

const getDefaultUserState = (): IUserDataContext => {
	let localData = localStorage.getItem("user");

	if (localData) {
		try {
			return JSON.parse(localData);
		} catch (e) {
			return {};
		}
	}
	return {};
};

const UserDataContext = createContext<IUserDataContext | undefined>(undefined);
const UserDispatchContext = createContext<Dispatch<any> | undefined>(undefined);

UserDataContext.displayName = "UserData";
UserDispatchContext.displayName = "UserDispatcher";

interface IUserProviderProps {
	children: React.ReactNode;
}

function UserProvider({ children }: IUserProviderProps) {
	const [state, reducer] = React.useReducer(userReducer, getDefaultUserState());
	return (
		<UserDataContext.Provider value={state}>
			l<UserDispatchContext.Provider value={reducer}>{children}</UserDispatchContext.Provider>
		</UserDataContext.Provider>
	);
}

function useAuth() {
	const context = React.useContext(UserDataContext);
	if (!context) {
		throw new Error("useAuth must be used within a UserProvider");
	}
	return context;
}

export { UserProvider, useAuth, UserDispatchContext };
