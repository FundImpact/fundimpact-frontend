import { BUDGET_ACTIONS } from "./constants";
import { IBudgetTargetForm } from "./budgetForm";

export interface IBudget {
	id?: string;
	name: string;
	description?: string;
	code: string;
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
			formAction: BUDGET_ACTIONS.UPDATE;
			initialValues: IBudgetTargetForm;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: BUDGET_ACTIONS.CREATE;
	  };
