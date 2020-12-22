import React, { createContext, Dispatch } from "react";
import { IDialogContext } from "../models";
import dialogReducer from "../reducers/dialogReducer";

const DialogDataContext = createContext<IDialogContext | undefined>(undefined);
const DialogDispatchContext = createContext<Dispatch<any> | undefined>(undefined);

const useDialogData = (): IDialogContext | undefined => {
	const context = React.useContext(DialogDataContext);
	if (!context) {
		throw new Error("useDialogData must be used within a DialogProvider");
	}
	return context;
};

const useDialogDispatch = () => {
	const context = React.useContext(DialogDispatchContext);
	if (!context) {
		throw new Error("useDialogDispatch must be used within a DialogProvider");
	}
	return context;
};

const defaultDialogState: IDialogContext = {
	component: undefined,
};

const DialogProvider = ({ children }: { children: React.ReactNode | React.ReactElement }) => {
	const [state, dispatch] = React.useReducer(
		dialogReducer,
		defaultDialogState,
		() => defaultDialogState
	);

	return (
		<DialogDataContext.Provider value={state}>
			<DialogDispatchContext.Provider value={dispatch}>
				{children}
			</DialogDispatchContext.Provider>
		</DialogDataContext.Provider>
	);
};

export { DialogProvider, useDialogData, useDialogDispatch };
