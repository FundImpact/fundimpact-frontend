import { FORM_ACTIONS } from "./constants";
import { IBudgetTargetForm } from "./budgetForm";

export interface IBudget {
	id?: string;
	name: string;
	description?: string;
	code: string;
}

export interface IBudgetTrackingLineitem {
	id?: string;
	amount: number;
	note: string;
	conversion_factor: number;
	budget_targets_project: string;
	annual_year: string;
	financial_years_org: string;
	financial_years_donor: string;
	grant_periods_project: string;
	organization_currency: string;
	donor: string;
	reporting_date: Date;
}

export interface IBudgetTarget {
	name: string;
	description: string;
	total_target_amount: number;
	conversion_factor: string;
	organization_currency: string;
	budget_category_organization: string;
	id?: string;
}

export type ICreateBudgetTargetProjectDialogProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IBudgetTargetForm;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
	  };
