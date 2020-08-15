import React, { createContext, Dispatch } from "react";
import { IDashboardDataContext } from "../models";
import dashboardReducer from "../reducers/dashboardReducer";

const DashboardDataContext = React.createContext<IDashboardDataContext | undefined>(undefined);
const DashboardDispatchContext = createContext<Dispatch<any> | undefined>(undefined);

const useDashBoardData = (): IDashboardDataContext | undefined => {
	const context = React.useContext(DashboardDataContext);
	if (!context) {
		throw new Error("useDashBoardData must be used within a DashboardProvider");
	}
	return context;
};

const useDashboardDispatch = () => {
	const context = React.useContext(DashboardDispatchContext);
	if (!context) {
		throw new Error("useDashboardDispatch must be used within a DashboardProvider");
	}
	return context;
};

const useDashboard = () => [useDashBoardData(), useDashboardDispatch()];

const defaultDashboardState: IDashboardDataContext = {};

const DashboardProvider = ({ children }: { children: React.ReactNode | React.ReactElement }) => {
	const [state, dispatch] = React.useReducer(
		dashboardReducer,
		defaultDashboardState,
		() => defaultDashboardState
	);
	return (
		<DashboardDataContext.Provider value={state}>
			<DashboardDispatchContext.Provider value={dispatch}>
				{children}
			</DashboardDispatchContext.Provider>
		</DashboardDataContext.Provider>
	);
};

export { useDashboardDispatch, useDashBoardData, useDashboard, DashboardProvider };
