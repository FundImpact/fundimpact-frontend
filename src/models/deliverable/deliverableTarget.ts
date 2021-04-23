import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { DIALOG_TYPE } from "../constants";

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
	dialogType?: DIALOG_TYPE;
} & (
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTarget;
	  }
);
