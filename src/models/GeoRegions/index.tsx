import { DIALOG_TYPE, FORM_ACTIONS } from "../constants";

export interface IGeoRegions {
	id?: string;
	name: string;
	project_id: string;
	is_project: any;
	description?: string;
	country_id?: string;
	state_id?: string;
	district_id?: string;
	block_id?: string;
	gp_id?: string;
	village_id?: string;
}

export type ProjectId = {
	id: string;
	name: string;
};

export interface IGET_GEO_REGIONS {
	orgGeoRegions: Partial<IGeoRegions>[];
}

export type IGeoRegionsProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IGeoRegions;
			getCreatedGeoRegions?: (geoRegions: IGeoRegions) => void;
			dialogType?: DIALOG_TYPE;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IGeoRegions;
			getCreatedGeoRegions?: (geoRegions: IGeoRegions) => void;
			dialogType?: DIALOG_TYPE;
	  };
