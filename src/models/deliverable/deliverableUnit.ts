import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverableUnit {
	id?: number;
	name: string;
	description?: string;
	code: string;
	deliverableCategory?: number | string;
	unit_type: number | string;
	prefix_label: number | string;
	suffix_label: number | string;
	organization?: number | string;
}

export type DeliverableUnitProps =
	| { type: DELIVERABLE_ACTIONS.CREATE; open: boolean; handleClose: () => void }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableUnit;
			open: boolean;
			handleClose: () => void;
	  };
