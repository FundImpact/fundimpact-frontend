import { IProject } from "../project/project";
import { IBudgetCategory } from ".";

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
		country: {
			id: string;
		};
	};
}

export interface IBUDGET_LINE_ITEM_RESPONSE {
	id: string;
	amount: number;
	note: string;
	budget_targets_project: {
		id: string;
	};
	annual_year: {
		id: string;
	};
	reporting_date: Date;
	fy_org: {
		id: string;
		name: string;
	};
	grant_periods_project: {
		id: string;
		name: string;
	};
	fy_donor: {
		id: string;
		name: string;
	};
}

export interface IGET_BUDGET_TARGET_PROJECT {
	projectBudgetTargets: IBudgetTargetProjectResponse[];
}

export interface IGET_BUDGET_CATEGORY {
	orgBudgetCategory: Partial<IBudgetCategory>[];
}

export interface IGET_BUDGET_TARCKING_LINE_ITEM {
	projBudgetTrackings: IBUDGET_LINE_ITEM_RESPONSE[];
}
