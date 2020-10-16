import { IDashboardDataContext } from "../models";
import { IOrganisation } from "../models/organisation/types";
import { IProject } from "../models/project/project";
import { IOrganisationWorkspaces } from "../models/workspace/query";

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

export const setProject = (data: IProject | undefined): Action => {
	return {
		type: "SET_PROJECT",
		payload: data,
	};
};

export default dashboardReducer;
