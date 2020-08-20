import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverable {
	id?: number;
	name: string;
	code?: string;
	description?: string;
	organization?: number | string;
}

export type DeliverableProps =
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
			open: boolean;
			handleClose: () => void;
			organization: number | string | undefined;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverable;
			open: boolean;
			handleClose: () => void;
	  };
