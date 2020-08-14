import { IOrganizationCurrency } from "../index";
import { IProject } from "../project/project";

export interface IBudgetTargetProjectResponse {
	id: string;
	name: string;
	total_target_amount: string;
	conversion_factor: string;
	organization_currency: IOrganizationCurrency;
	project: Partial<IProject>;
	description: string;
}

export interface IGET_BUDGET_TARGET_PROJECT {
	budgetTargetsProjects: IBudgetTargetProjectResponse[];
}
