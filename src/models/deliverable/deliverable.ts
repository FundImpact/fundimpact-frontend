import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverable {
	id?: number;
	name: string;
	code?: string;
	description?: string;
	project?: number | string;
}

export type DeliverableProps =
	| { type: DELIVERABLE_ACTIONS.CREATE; project: number }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverable;
			project: number;
	  };
