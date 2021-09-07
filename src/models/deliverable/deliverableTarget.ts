import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { DELIVERABLE_TYPE, DIALOG_TYPE } from "../constants";

export interface IDeliverableTarget {
	id?: number;
	name: string;
	description?: string;
	target_value: number;
	deliverable_category_org?: number | string;
	deliverable_unit_org?: number | string;
	project?: number | string;
}

export type DeliverableTargetProps = {
	open: boolean;
	handleClose: () => void;
	project: number | undefined;
	formType: DELIVERABLE_TYPE;
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
