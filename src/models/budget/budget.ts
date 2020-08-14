import { BUDGET_ACTIONS } from "./constants";

export interface IBudget {
	id?: string;
	name: string;
	description?: string;
	code: string;
}

export interface IBudgetTarget {
	name: string;
	description: string;
	total_target_amount: string;
	conversion_factor: string;
	organization_currency: string;
	budget_category: string;
	id?: string;
}

export type ICreateBudgetTargetProjectDialogProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: BUDGET_ACTIONS.UPDATE;
			initialValues: IBudgetTarget;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: BUDGET_ACTIONS.CREATE;
	  };
