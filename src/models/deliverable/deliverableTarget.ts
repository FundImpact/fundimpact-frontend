import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { DELIVERABLE_TYPE, DIALOG_TYPE, FORM_ACTIONS } from "../constants";

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
	category?: number | string;
	unit?: number | string;
	project?: number | string;
}

export type DeliverableTargetProps = {
	open: boolean;
	project: number | undefined;
	formType: DELIVERABLE_TYPE;
	dialogType?: DIALOG_TYPE;
} & (
	| {
			open: boolean;
			handleClose: () => void;
			project: number | undefined;
			type: DELIVERABLE_ACTIONS.CREATE;
			formType: DELIVERABLE_TYPE;
			dialogType?: DIALOG_TYPE;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			project: number | undefined;
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTarget;
			value_qualitative_option: { id: string; name: string }[];
			formType: DELIVERABLE_TYPE;
			dialogType?: DIALOG_TYPE;
	  }
);
