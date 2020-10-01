import { BUDGET_CATEGORY_MODULE } from "./modules/budgetCategory/budgetCategory.module";
import { BUDGET_TARGET_MODULE } from "./modules/budgetTarget/budgetTarget.module";
import { BUDGET_TARGET_LINE_ITEM_MODULE } from "./modules/budgetTargetLineItem/budgetTargetLineItem.module";
import { IMPACT_CATEGORY_MODULE } from "./modules/impactCategory/impactCategory.module";
import { IMPACT_TARGET_MODULE } from "./modules/impactTarget/impactTarget.module";
import { IMPACT_UNIT_MODULE } from "./modules/impactUnit/impactUnit.module";
import { IMPACT_TRACKING_LINE_ITEM_MODULE } from "./modules/impactTrackingLineItem/impactTrackingLineItem.module";
import { DELIVERABLE_CATEGORY_MODULE } from "./modules/deliverableCategory/deliverableCategory.module";
import { DELIVERABLE_TARGET_MODULE } from "./modules/deliverableTarget/deliverableTarget.module";
import { DELIVERABLE_TRACKING_LINE_ITEM_MODULE } from "./modules/deliverableTrackingLineItem/deliverableTrackingLineItem.module";
import { DELIVERABLE_UNIT_MODULE } from "./modules/deliverableUnit/deliverableUnit.module";
import { SETTING_MODULE } from "./modules/setting/setting.module";
import { PROJECT_MODULE } from "./modules/project/project.module";
import { WORKSPACE_MODULE } from "./modules/workspaces/workspace.module";
import { ORGANIZATION_MODULE } from "./modules/organization/organization.module";
import { DONOR_MODULE } from "./modules/donor/donor.module";
import { GRANT_PERIOD_MODULE } from "./modules/grantPeriod/grantPeriod.module";
import { MODULE_CODES } from "./moduleCodes";
import { PROJECT_DONOR_MODULE } from "./modules/projectDonor/projectDonor.module";
import { BUDGET_TARGET_DONOR_MODULE } from "./modules/budgetTargetDonor/budgetTargetDonor.module";
import { ANNUAL_YEAR_MODULE } from "./modules/annualYear/annualYear.module";
import { FINANCIAL_YEAR_ORG_MODULE } from "./modules/financialYearOrg/financialYearOrg.module";
import { FINANCIAL_YEAR_DONOR_MODULE } from "./modules/financialYearDonor/financialYearDonor.module";

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
	[MODULE_CODES.BUDGET_CATEGORY]: BUDGET_CATEGORY_MODULE,
	[MODULE_CODES.BUDGET_TARGET]: BUDGET_TARGET_MODULE,
	[MODULE_CODES.BUDGET_TARGET_LINE_ITEM]: BUDGET_TARGET_LINE_ITEM_MODULE,
	[MODULE_CODES.DELIVERABLE_CATEGORY]: DELIVERABLE_CATEGORY_MODULE,
	[MODULE_CODES.DELIVERABLE_TARGET]: DELIVERABLE_TARGET_MODULE,
	[MODULE_CODES.DELIVERABLE_TRACKING_LINE_ITEM]: DELIVERABLE_TRACKING_LINE_ITEM_MODULE,
	[MODULE_CODES.DELIVERABLE_UNIT]: DELIVERABLE_UNIT_MODULE,
	[MODULE_CODES.IMPACT_CATEGORY]: IMPACT_CATEGORY_MODULE,
	[MODULE_CODES.IMPACT_TARGET]: IMPACT_TARGET_MODULE,
	[MODULE_CODES.IMPACT_TRACKING_LINE_ITEM]: IMPACT_TRACKING_LINE_ITEM_MODULE,
	[MODULE_CODES.IMPACT_UNIT]: IMPACT_UNIT_MODULE,
	[MODULE_CODES.SETTING]: SETTING_MODULE,
	[MODULE_CODES.WORKSPACE]: WORKSPACE_MODULE,
	[MODULE_CODES.PEOJECT]: PROJECT_MODULE,
	[MODULE_CODES.ORGANIZATION]: ORGANIZATION_MODULE,
	[MODULE_CODES.DONOR]: DONOR_MODULE,
	[MODULE_CODES.GRANT_PERIOD]: GRANT_PERIOD_MODULE,
	[MODULE_CODES.PROJECT_DONOR]: PROJECT_DONOR_MODULE,
	[MODULE_CODES.BUDGET_TARGET_DONOR]: BUDGET_TARGET_DONOR_MODULE,
	[MODULE_CODES.ANNUAL_YEAR]: ANNUAL_YEAR_MODULE,
	[MODULE_CODES.FINANCIAL_YEAR_ORG]: FINANCIAL_YEAR_ORG_MODULE,
	[MODULE_CODES.FINANCIAL_YEAR_DONOR]: FINANCIAL_YEAR_DONOR_MODULE,
} as const;
