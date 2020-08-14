import { IBudget, IBudgetTarget } from "./budget";
import { IOrganizationCurrency } from "../index";
import { BUDGET_ACTIONS } from "./constants";

export interface IBudgetFormProps {
	initialValues: IBudget;
	onSubmit: (values: IBudget) => void;
	validate: any;
	onCancel: () => void;
}

export interface IBudgetTargetFormProps {
	initialValues: IBudgetTarget;
	onCreate: (values: IBudgetTarget) => void;
	onUpdate: (values: IBudgetTarget) => void;
	validate: any;
	onCancel: () => void;
	organizationCurrencies: IOrganizationCurrency[];
	budgetCategory: IBudget[];
	formAction: BUDGET_ACTIONS.CREATE | BUDGET_ACTIONS.UPDATE;
}
