import { FORM_ACTIONS } from "./constants";
import { IBudgetTargetForm, IBudgetTrackingLineitemForm } from "./budgetForm";

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
	budget_targets_project: string;
	annual_year: string;
	reporting_date: string;
}

export interface IBudgetTarget {
	name: string;
	description: string;
	total_target_amount: number;
	budget_category_organization: string;
	id?: string;
	donor: string
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
		
export type ICreateBudgetTrackingLineitemDialogProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IBudgetTrackingLineitem;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IBudgetTrackingLineitemForm;
	  };
