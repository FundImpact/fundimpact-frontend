import { IBudget, IBudgetTarget } from "./budget";
import { IOrganizationCurrency } from "../index";
import { BUDGET_ACTIONS } from "./constants";

export interface IBudgetFormProps {
	initialValues: IBudget;
	onSubmit: (values: IBudget) => void;
	validate: any;
	onCancel: () => void;
}

export interface IBudgetTargetForm extends Omit<IBudgetTarget, "total_target_amount"> {
	total_target_amount: string;
}

export interface IBudgetTargetFormProps {
	initialValues: IBudgetTargetForm;
	onCreate: (values: IBudgetTargetForm) => void;
	onUpdate: (values: IBudgetTargetForm) => void;
	validate: any;
	onCancel: () => void;
	organizationCurrencies: IOrganizationCurrency[];
	budgetCategory: IBudget[];
	formAction: BUDGET_ACTIONS.CREATE | BUDGET_ACTIONS.UPDATE;
}
