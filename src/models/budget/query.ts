import { IProject } from "../project/project";
import { IBudget } from "../budget/budget";

export interface IBudgetTargetProjectResponse {
	id: string;
	name: string;
	total_target_amount: string;
	project: Partial<IProject>;
	description: string;
	budget_category_organization: {
		id: string;
		name: string;
	};
	donor: {
		name: string;
		id: string;
	}
}

export interface IBUDGET_TRACKING_LINE_ITEM_RESPONSE {
	amount: number;
	note: string;
	budget_targets_project: {
		id: string;
	};
	annual_year: {
		id: string;
	};
	reporting_date: Date;
	id: string;
}

export interface IGET_BUDGET_TARGET_PROJECT {
	projectBudgetTargets: IBudgetTargetProjectResponse[];
}

export interface IGET_BUDGET_CATEGORY {
	orgBudgetCategory: Partial<IBudget>[];
}

export interface IGET_BUDGET_TARCKING_LINE_ITEM {
	projBudgetTrackings: IBUDGET_TRACKING_LINE_ITEM_RESPONSE[];
}
