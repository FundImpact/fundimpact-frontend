// import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { GEOGRAPHIES_ACTIONS } from "../../components/Geographies/constants";
import { DIALOG_TYPE } from "../constants";

export interface IGeographiesVillage {
	// export interface IDeliverableUnit {
	id?: number;
	name: string;
	block?: string;
	code: string;
	// unit_type: number | string;
	// prefix_label: number | string;
	// suffix_label: number | string;
	// organization?: number | string;
}

export interface IGeographiesVillageData extends Omit<IGeographiesVillage, "organization" | "id"> {
	id: string;
}

export type GeographiesVillageProps = {
	open: boolean;
	handleClose: () => void;
	organization: number | string | undefined;
	dialogType?: DIALOG_TYPE;
} & (
	| {
			type: GEOGRAPHIES_ACTIONS.CREATE;
	  }
	| {
			type: GEOGRAPHIES_ACTIONS.UPDATE;
			data: IGeographiesVillage;
			// data: IDeliverableUnit;
	  }
);
