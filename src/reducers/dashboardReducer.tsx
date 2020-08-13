import { IDashboardDataContext, IOrganisation } from "../models";
import { IOrganisationWorkspaces } from "../models/workspace/query";
import { IProject } from "../models/project/project";

interface Action {
	type: "SET_ORGANISATION" | "SET_WORKSPACE" | "SET_PROJECT";
	payload?: any;
}

/**
 * Handles user state
 * @param state
 * @param action
 */
const dashboardReducer = (state: IDashboardDataContext, action: Action) => {
	switch (action.type) {
		case "SET_ORGANISATION":
			return {
				...state,
				organization: action.payload,
			};
		case "SET_WORKSPACE":
			return {
				...state,
				workspace: action.payload,
			};
		case "SET_PROJECT":
			return {
				...state,
				project: action.payload,
			};
	}
	return state;
};

export const setOrganisation = (data: IOrganisation): Action => {
	return {
		type: "SET_ORGANISATION",
		payload: data,
	};
};
export const setActiveWorkSpace = (data: IOrganisationWorkspaces): Action => {
	return {
		type: "SET_WORKSPACE",
		payload: data,
	};
};

export const setProject = (data: IProject): Action => {
	return {
		type: "SET_PROJECT",
		payload: data,
	};
};

export default dashboardReducer;
