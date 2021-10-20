// import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { GEOGRAPHIES_ACTIONS } from "../../components/Geographies/constants";
import { DIALOG_TYPE } from "../constants";

export interface IGeographies {
	id?: number;
	name: string;
	code?: string;
	description?: string;
	organization?: number | string;
}

export interface IGeographiesCountryData extends Omit<IGeographies, "id" | "organization"> {
	// export interface IDeliverableCategoryData extends Omit<IDeliverable, "id" | "organization"> {
	id: string;
}

export type GeographiesProps =
	| {
			type: GEOGRAPHIES_ACTIONS.CREATE;
			// type: DELIVERABLE_ACTIONS.CREATE;
			open: boolean;
			handleClose: () => void;
			organization: number | string | undefined;
			dialogType?: DIALOG_TYPE;
	  }
	| {
			type: GEOGRAPHIES_ACTIONS.UPDATE;
			// type: DELIVERABLE_ACTIONS.UPDATE;
			data: IGeographies;
			// data: IDeliverable;
			open: boolean;
			handleClose: () => void;
			dialogType?: DIALOG_TYPE;
	  };

// workspaces: NonNullable < Pick < IWorkspace, "id" | ("name" >> []);

export interface IDeliverableCategoryUnitTableFilter {
	name: string;
	code: string;
	description: string;
}

export interface IImpactCategoryUnitTableFilter {
	name: string;
	code: string;
	description: string;
}
