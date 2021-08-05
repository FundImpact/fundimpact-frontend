import { DIALOG_TYPE, FORM_ACTIONS } from "../constants";

export type ISubTarget = {
	id?: number;
	budget_targets_project?: number | string;
	target?: number | string;
	deliverable_target_project?: number | string;
	impact_target_project?: number | string;
	project: number | string;
	target_value: number;
	timeperiod_start: Date | string;
	timeperiod_end: Date | string;
	financial_year_org?: number | string;
	financial_year_donor?: number | string;
	annual_year?: number | string;
	grant_periods_project?: number | string;
	donor?: number | string;
};

export type SubTargetFormProps = {
	open: boolean;
	handleClose: () => void;
	project?: number | undefined;
	formType: "budget" | "deliverable" | "impact";
	dialogType?: DIALOG_TYPE;
} & (
	| {
			formAction: FORM_ACTIONS.CREATE;
			target?: string | number;
	  }
	| {
			formAction: FORM_ACTIONS.UPDATE;
			data: ISubTarget;
			reftechOnSuccess: any;
	  }
);
