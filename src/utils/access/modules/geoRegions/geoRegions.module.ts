import { MODULE_CODES } from "../../moduleCodes";
import { GEO_REGIONS_ACTIONS } from "./actions";

export const GEO_REGIONS_MODULE = {
	name: "Geo Regions",
	code: MODULE_CODES.BUDGET_CATEGORY,
	actionsAvailable: {
		[GEO_REGIONS_ACTIONS.CREATE_GEO_REGIONS]: {
			name: "Create Geo Regions",
			code: GEO_REGIONS_ACTIONS.CREATE_GEO_REGIONS,
		},
		[GEO_REGIONS_ACTIONS.UPDATE_GEO_REGIONS]: {
			name: "Update Geo Regions",
			code: GEO_REGIONS_ACTIONS.UPDATE_GEO_REGIONS,
		},
		[GEO_REGIONS_ACTIONS.DELETE_GEO_REGIONS]: {
			name: "Delete Geo Regions",
			code: GEO_REGIONS_ACTIONS.DELETE_GEO_REGIONS,
		},
		[GEO_REGIONS_ACTIONS.FIND_GEO_REGIONS]: {
			name: "Find Geo Regions",
			code: GEO_REGIONS_ACTIONS.FIND_GEO_REGIONS,
		},
		[GEO_REGIONS_ACTIONS.GEO_REGIONS_IMPORT_FROM_CSV]: {
			name: "create Geo Regions org from csv",
			code: GEO_REGIONS_ACTIONS.GEO_REGIONS_IMPORT_FROM_CSV,
		},
		[GEO_REGIONS_ACTIONS.GEO_REGIONS_EXPORT]: {
			name: "Geo Regions Export",
			code: GEO_REGIONS_ACTIONS.GEO_REGIONS_EXPORT,
		},
	},
};
