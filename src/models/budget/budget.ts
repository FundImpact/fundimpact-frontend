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
	organizationCurrencyId: string;
	budget_category: string;
}
