import { IBudget, IBudgetTarget } from "./budget";
import { IOrganizationCurrency } from "../index";

export interface IBudgetFormProps {
	initialValues: IBudget;
	onSubmit: (values: IBudget) => void;
	validate: any;
	onCancel: () => void;
}

export interface IBudgetTargetFormProps {
	initialValues: IBudgetTarget;
	onSubmit: (values: IBudgetTarget) => void;
	validate: any;
	onCancel: () => void;
	organizationCurrencies: IOrganizationCurrency[];
	budgetCategory: IBudget[];
}
