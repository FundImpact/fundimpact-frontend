import React, { createContext, Dispatch } from "react";
import { INotificationContext } from "../models/";
import notificationReducer from "../reducers/notificationReducer";

const NotificationDataContext = createContext<INotificationContext | undefined>(undefined);
const NotificationdDispatchContext = createContext<Dispatch<any> | undefined>(undefined);

const useNotificationData = (): INotificationContext | undefined => {
	const context = React.useContext(NotificationDataContext);
	if (!context) {
		throw new Error("useNotificationData must be used within a NotificationProvider");
	}
	return context;
};

const useNotificationDispatch = () => {
	const context = React.useContext(NotificationdDispatchContext);
	if (!context) {
		throw new Error("useNotificationDispatch must be used within a NotificationProvider");
	}
	return context;
};

const defaultNotificationState: INotificationContext = {
	errorNotification: "",
	successNotification: "",
};

const NotificationProvider = ({ children }: { children: React.ReactNode | React.ReactElement }) => {
	const [state, dispatch] = React.useReducer(
		notificationReducer,
		defaultNotificationState,
		() => defaultNotificationState
	);

	return (
		<NotificationDataContext.Provider value={state}>
			<NotificationdDispatchContext.Provider value={dispatch}>
				{children}
			</NotificationdDispatchContext.Provider>
		</NotificationDataContext.Provider>
	);
};

export { NotificationProvider, useNotificationData, useNotificationDispatch };
