import { IOrganizationCurrency } from "../index";
import { IProject } from "../project/project";

export interface IBudgetTargetProjectResponse {
	description: string;
	id: string;
	name: string;
	total_target_amount: number;
	conversion_factor: number;
	organization_currency: Partial<IOrganizationCurrency>;
	project: Partial<IProject>;
}

export interface IGET_BUDGET_TARGET_PROJECT {
	budgetTargetsProjects: IBudgetTargetProjectResponse[];
}
