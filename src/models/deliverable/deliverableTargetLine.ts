import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverableTargetLine {
	id?: number;
	deliverable_target_project: number | string | undefined;
	annual_year: string;
	value: string;
	financial_years_org: number | string;
	financial_years_donor: number | string;
	reporting_date: string;
	note?: string;
}

export type DeliverableTargetLineProps =
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
			open: boolean;
			handleClose: () => void;
			deliverableTarget: number | string | undefined;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTargetLine;
			open: boolean;
			handleClose: () => void;
			deliverableTarget: number | string | undefined;
	  };
