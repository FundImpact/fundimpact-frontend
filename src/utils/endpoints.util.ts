const { REACT_APP_BASEURL } = process.env;

export const LOGIN_API = `${REACT_APP_BASEURL}auth/local`;
export const FORGOT_PASSWORD_API = `${REACT_APP_BASEURL}auth/forgot-password`;

// export const LOGIN_API = `https://dev.fundimpact.org/auth/local`;
export const SIGNUP_API = `${REACT_APP_BASEURL}auth/local/register`;
export const ORGANISATION_TYPES_API = `${REACT_APP_BASEURL}organisation-registration-types`;
export const COUNTRY_LIST_API = `${REACT_APP_BASEURL}countries`;
export const FILE_UPLOAD = `${REACT_APP_BASEURL}upload`;
export const FILE_UPLOAD_MORPH = `${REACT_APP_BASEURL}upload/file-morph`;
//Todo remove /
export const BUDGET_CATEGORY_TABLE_EXPORT = `${REACT_APP_BASEURL}budget-category-organizations/export-table`;
export const DELIVERABLE_CATEGORY_TABLE_EXPORT = `${REACT_APP_BASEURL}deliverable-category-orgs/export-table`;
export const DELIVERABLE_UNIT_TABLE_EXPORT = `${REACT_APP_BASEURL}deliverable-units-orgs/export-table`;
export const IMPACT_CATEGORY_TABLE_EXPORT = `${REACT_APP_BASEURL}impact-category-orgs/export-table`;
export const IMPACT_UNIT_TABLE_EXPORT = `${REACT_APP_BASEURL}impact-units-orgs/export-table`;
export const BUDGET_TARGET_PROJECTS_TABLE_EXPORT = `${REACT_APP_BASEURL}budget-targets-projects/export-table`;
export const BUDGET_LINE_ITEM_TABLE_EXPORT = `${REACT_APP_BASEURL}budget-tracking-lineitems/export-table`;
export const DELIVERABLE_TARGET_PROJECTS_TABLE_EXPORT = `${REACT_APP_BASEURL}deliverable-target-projects/export-table`;
export const DELIVERABLE_LINE_ITEM_PROJECTS_TABLE_EXPORT = `${REACT_APP_BASEURL}deliverable-tracking-lineitems/export-table`;
export const IMPACT_TARGET_PROJECTS_TABLE_EXPORT = `${REACT_APP_BASEURL}impact-target-projects/export-table`;
export const IMPACT_LINE_ITEM_PROJECTS_TABLE_EXPORT = `${REACT_APP_BASEURL}impact-tracking-lineitems/export-table`;
export const FUND_RECEIPT_TABLE_EXPORT = `${REACT_APP_BASEURL}fund-receipt-projects/export-table`;
export const GRANT_PERIOD_TABLE_EXPORT = `${REACT_APP_BASEURL}grant-periods-projects/export-table`;
export const BUDGET_CATEGORY_TABLE_IMPORT = `${REACT_APP_BASEURL}budget-category-organizations/import-table`;
export const DELIVERABLE_CATEGORY_TABLE_IMPORT = `${REACT_APP_BASEURL}deliverable-category-orgs/import-table`;
export const DELIVERABLE_UNIT_TABLE_IMPORT = `${REACT_APP_BASEURL}deliverable-units-orgs/import-table`;
export const IMPACT_CATEGORY_TABLE_IMPORT = `${REACT_APP_BASEURL}impact-category-orgs/import-table`;
export const IMPACT_UNIT_TABLE_IMPORT = `${REACT_APP_BASEURL}impact-units-orgs/import-table`;
export const BUDGET_TARGET_PROJECTS_TABLE_IMPORT = `${REACT_APP_BASEURL}budget-targets-projects/import-table`;
export const BUDGET_LINE_ITEM_TABLE_IMPORT = `${REACT_APP_BASEURL}budget-tracking-lineitems/import-table`;
export const DELIVERABLE_TARGET_PROJECTS_TABLE_IMPORT = `${REACT_APP_BASEURL}deliverable-target-projects/import-table`;
export const DELIVERABLE_LINE_ITEM_PROJECTS_TABLE_IMPORT = `${REACT_APP_BASEURL}deliverable-tracking-lineitems/import-table`;
export const IMPACT_TARGET_PROJECTS_TABLE_IMPORT = `${REACT_APP_BASEURL}impact-target-projects/import-table`;
export const IMPACT_LINE_ITEM_PROJECTS_TABLE_IMPORT = `${REACT_APP_BASEURL}impact-tracking-lineitems/import-table`;
export const FUND_RECEIPT_TABLE_IMPORT = `${REACT_APP_BASEURL}fund-receipt-projects/import-table`;
export const GRANT_PERIOD_TABLE_IMPORT = `${REACT_APP_BASEURL}grant-periods-projects/import-table`;
export const DELIVERABLE_CATEGORY_UNIT_EXPORT = `${REACT_APP_BASEURL}deliverable-category-units/export-table`;
export const IMPACT_CATEGORY_UNIT_EXPORT = `${REACT_APP_BASEURL}impact-category-units/export-table`;
export const DONOR_EXPORT = `${REACT_APP_BASEURL}donors/export-table`;
export const DONOR_IMPORT = `${REACT_APP_BASEURL}donors/import-table`;
export const SUSTAINABLE_DEVELOPMENT_GOALS_EXPORT = `${REACT_APP_BASEURL}sustainable-development-goals/export-table`;
export const ANNUAL_YEAR_EXPORT = `${REACT_APP_BASEURL}annual-years/export-table`;
export const FINANCIAL_YEAR_EXPORT = `${REACT_APP_BASEURL}financial-years/export-table`;
export const COUNTRY_EXPORT = `${REACT_APP_BASEURL}countries/export-table`;
export const PROJECT_EXPORT = `${REACT_APP_BASEURL}projects/export-table`;
export const INDIVIDUAL_EXPORT = `${REACT_APP_BASEURL}t-4-d-individuals/export-table`;
export const INDIVIDUAL_IMPORT = `${REACT_APP_BASEURL}t-4-d-individuals/import-table`;
