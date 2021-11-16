import { IBudgetTarget, IBudgetTrackingLineitem } from ".";

export interface IBudgetTrackingLineitemForm
	extends Omit<
		IBudgetTrackingLineitem,
		"amount" | "conversion_factor" | "reporting_date" | "geo_regions"
	> {
	amount: string;
	reporting_date: string;
	geo_region_id?: string;
}

export interface IBudgetTargetForm extends Omit<IBudgetTarget, "total_target_amount"> {
	total_target_amount: string;
}
