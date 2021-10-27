import { DIALOG_TYPE, FORM_ACTIONS } from "../constants";

export interface IGeoRegions {
	id?: string;
	name: string;
	description?: string;
	code: string;
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
