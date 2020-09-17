import { BUDGET_MODULE } from "./modules/budget/budget.module";
import { IMPACT_MODULE } from "./modules/impact/impact.module";

export enum MODULE_CODES {
	BUDGET = "budget",
	IMPACT = "impact",
	// DELIVERABLES = "deliverables",
	// GRANT_PERIOD = "grant_period",
}

export const MODULES = {
	[MODULE_CODES.BUDGET]: BUDGET_MODULE,
	[MODULE_CODES.IMPACT]: IMPACT_MODULE,
} as const;
