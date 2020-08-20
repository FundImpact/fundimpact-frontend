import { IBudget, IBudgetTarget, IBudgetTrackingLineitem } from "./budget";
import { IOrganizationCurrency } from "../index";
import { FORM_ACTIONS } from "./constants";

export interface IBudgetFormProps {
	initialValues: IBudget;
	onSubmit: (values: IBudget) => void;
	validate: any;
	onCancel: () => void;
}

export interface IBudgetTrackingLineitemForm
	extends Omit<IBudgetTrackingLineitem, "amount" | "conversion_factor" | "reporting_date"> {
	amount: string;
	conversion_factor: string;
	reporting_date: string;
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
	formAction: FORM_ACTIONS.CREATE | FORM_ACTIONS.UPDATE;
}
