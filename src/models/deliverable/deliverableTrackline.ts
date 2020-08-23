import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

export interface IDeliverableTargetLine {
	id?: number;
	deliverable_target_project: number | string | undefined;
	annual_year: string;
	value: number;
	financial_years_org?: number | string;
	financial_years_donor?: number | string;
	grant_period?: number | string;
	reporting_date: Date | string;
	note?: string;
}

export type DeliverableTargetLineProps = {
	open: boolean;
	handleClose: () => void;
	deliverableTarget?: number | string | undefined;
} & (
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTargetLine;
	  }
);
