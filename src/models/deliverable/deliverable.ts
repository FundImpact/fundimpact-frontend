import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverable {
	id?: number;
	name: string;
	code?: string;
	description?: string;
	project?: number | string;
}

export type DeliverableProps =
	| { type: DELIVERABLE_ACTIONS.CREATE; project: number; open: boolean; handleClose: () => void }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverable;
			project: number;
			open: boolean;
			handleClose: () => void;
	  };
