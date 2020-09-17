import { BUDGET_MODULE } from "./modules/budget/budget.module";
import { DELIVERABLES_MODULE } from "./modules/deliverables/deliverable.module";
import { IMPACT_MODULE } from "./modules/impact/impact.module";

/**
 * @summary This file contains 2 important factors related to module.
 * 1. Module Codes
 * 2. Modules Mapping.
 *
 */

/**
 ************************************ MODULE CODE******************************
 * Every Module must has codes from the list below <code>MODULE_CODES</code>.
 * If any Module is using code other than these, are considered invalid.
 *
 * Whenever a new modules is created or removed from the application, their module code
 * must be added / removed from the list. Keep the module code property name in UPPERCASE
 * and value in lowercase.
 */
export enum MODULE_CODES {
	BUDGET = "budget",
	IMPACT = "impact",
	DELIVERABLES = "deliverables",
	// GRANT_PERIOD = "grant_period",
}

/**
 ************************************* Module MAPPING ****************************
 * Whenever a new module is created, it must be mapped to its code inside <code>MODULES</code>.
 * It the mapping is not done, then the module will not be funtional.
 *
 *
 * @Example
 * Assume we have created a new module called ModuleA, with the module code `moduleCodeA`.
 * then, the final mapping will be
 *
 *  MODULES = {
 *	[MODULE_CODES.BUDGET]: BUDGET_MODULE,
 * 	[MODULE_CODES.IMPACT]: IMPACT_MODULE,
 *	[MODULE_CODES.DELIVERABLES]: DELIVERABLES_MODULE,
 *  [MODULE_CODE.MODULE_CODE_A]: ModuleA
 *  }
 *
 */
export const MODULES = {
	[MODULE_CODES.BUDGET]: BUDGET_MODULE,
	[MODULE_CODES.IMPACT]: IMPACT_MODULE,
	[MODULE_CODES.DELIVERABLES]: DELIVERABLES_MODULE,
} as const;
