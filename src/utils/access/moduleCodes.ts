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
	SETTING = "setting",
	BUDGET_CATEGORY = "budget-category-organization",
	BUDGET_TARGET = "budget-targets-project",
	BUDGET_TARGET_LINE_ITEM = "budget-tracking-lineitem",
	DELIVERABLE_CATEGORY = "deliverable-category-org",
	DELIVERABLE_UNIT = "deliverable-units-org",
	DELIVERABLE_TARGET = "deliverable-target-project",
	DELIVERABLE_TRACKING_LINE_ITEM = "deliverable-tracking-lineitem",
	IMPACT_CATEGORY = "impact-category-org",
	IMPACT_UNIT = "impact-units-org",
	IMPACT_TARGET = "impact-target-project",
	IMPACT_TRACKING_LINE_ITEM = "impact-tracking-lineitem",
	WORKSPACE = "workspace",
	PEOJECT = "project",
	ORGANIZATION = "organization",
	DONOR = "donor",
	GRANT_PERIOD = "grant-periods-project",
}
