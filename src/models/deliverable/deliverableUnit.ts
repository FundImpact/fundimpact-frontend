import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { DIALOG_TYPE } from "../constants";

export interface IDeliverableUnit {
	id?: number;
	name: string;
	description?: string;
	code: string;
	unit_type: number | string;
	prefix_label: number | string;
	suffix_label: number | string;
	organization?: number | string;
}

export interface IDeliverableUnitData extends Omit<IDeliverableUnit, "organization" | "id"> {
	id: string;
}

export type DeliverableUnitProps = {
	open: boolean;
	handleClose: () => void;
	organization: number | string | undefined;
	dialogType?: DIALOG_TYPE;
} & (
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableUnit;
	  }
);
