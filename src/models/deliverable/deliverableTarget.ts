import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { DELIVERABLE_TYPE, DIALOG_TYPE } from "../constants";

export enum ValueCalculations {
	SUM = "sum",
	AVERAGE = "avg",
}

export interface IDeliverableTarget {
	id?: number;
	name: string;
	description?: string;
	is_qualitative?: boolean;
	sub_target_required?: boolean;
	value_calculation?: ValueCalculations;
	value_qualitative_option?: any;
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
			value_qualitative_option: { id: string; name: string }[];
	  }
);
