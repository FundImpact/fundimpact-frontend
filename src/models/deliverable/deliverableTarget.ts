import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverableTarget {
	id?: number;
	name: string;
	description?: string;
	target_value: number;
	deliverableCategory?: number | string;
	deliverableUnit?: number | string;
	deliverable_category_unit: number | string;
	project?: number | string;
}

export type DeliverableTargetProps = {
	open: boolean;
	handleClose: () => void;
	project: number | undefined;
} & (
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTarget;
	  }
);
