import { DELIVERABLE_TYPE, DIALOG_TYPE, FORM_ACTIONS } from "../constants";

export type ISubTarget = {
	id?: number;
	name: string;
	budget_targets_project?: number | string;
	target?: number | string;
	deliverable_target_project?: any;
	impact_target_project?: number | string;
	project: number | string;
	target_value: number;
	target_value_qualitative: string;
	timeperiod_start: Date | string;
	timeperiod_end: Date | string;
	financial_year_org?: number | string;
	financial_year_donor?: number | string;
	annual_year?: number | string;
	grant_periods_project?: number | string;
	donor?: number | string;
	geo_region_id?: number | string;
};

export type SubTargetFormProps = {
	open: boolean;
	handleClose: () => void;
	project?: number | undefined;
	formType: "budget" | DELIVERABLE_TYPE;
	dialogType?: DIALOG_TYPE;
	qualitativeParent?: boolean;
	targetValueOptions?: { id: string; name: string }[];
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
