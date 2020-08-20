import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverableTarget {
	id?: number;
	name: string;
	description?: string;
	target_value: string | number;
	deliverableCategory?: number | string;
	deliverableUnit?: number | string;
	deliverable_category_unit: number | string;
	project?: number | string;
}

export type DeliverableTargetProps =
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
			open: boolean;
			handleClose: () => void;
			project: number | string | undefined;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTarget;
			open: boolean;
			handleClose: () => void;
			project: number | string | undefined;
	  };
