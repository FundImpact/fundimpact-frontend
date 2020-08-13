import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverableTarget {
	id?: number;
	name: string;
	description?: string;
	targetValue: string;
	deliverableCategory: number | string;
	deliverableUnit: number | string;
	deliverableCategoryUnit: number | string;
	targetDates?: string;
	project?: number | string;
}

export type DeliverableTargetProps =
	| { type: DELIVERABLE_ACTIONS.CREATE; open: boolean; handleClose: () => void }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTarget;
			open: boolean;
			handleClose: () => void;
	  };
