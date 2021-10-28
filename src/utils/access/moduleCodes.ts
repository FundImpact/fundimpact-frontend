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
	// GEOGRAPHIES_COUNTRY = "geography-country-org",
	// GEOGRAPHIES_STATE = "geography-state-org",
	// GEOGRAPHIES_DISTRICT = "geography-district-org",
	// GEOGRAPHIES_BLOCK = "geography-block-org",
	// GEOGRAPHIES_GRAMPANCHAYAT = "geography-grampanchayat-org",
	// GEOGRAPHIES_VILLAGE = "geography-village-org",
	IMPACT_CATEGORY = "impact-category-org",
	IMPACT_UNIT = "impact-units-org",
	IMPACT_TARGET = "impact-target-project",
	IMPACT_TRACKING_LINE_ITEM = "impact-tracking-lineitem",
	WORKSPACE = "workspace",
	PEOJECT = "project",
	ORGANIZATION = "organization",
	DONOR = "donor",
	GRANT_PERIOD = "grant-periods-project",
	PROJECT_DONOR = "project-donor",
	BUDGET_TARGET_DONOR = "budget-targets-donor",
	ANNUAL_YEAR = "annual-year",
	FINANCIAL_YEAR_DONOR = "financial-years-donor",
	FINANCIAL_YEAR_ORG = "financial-years-org",
	FINANCIAL_YEAR = "financial-year",
	SUSTAINABLE_DEVELOPMENT_GOALS = "sustainable-development-goals",
	ACCOUNT = "account",
	COUNTRY = "country",
	CURRENCY = "currency",
	USER_PERMISSIONS = "userspermissions",
	AUTH = "auth",
	FUND_RECEIPT = "fund-receipt-project",
	CONTACT = "t4d-contact",
	ADDRESS = "t4d-address",
	INDIVIDUAL = "t4d-individual",
	YEAR_TAG = "year-tag",
}
