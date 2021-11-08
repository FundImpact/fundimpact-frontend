import { ITableHeadings } from "../../models";

export const deliverableHeadings: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Category" },
	{ label: "Target", keyMapping: "target_value" },
	{ label: "Achieved" },
	{ label: "Progess" },
	{ label: "" }, //edit icon
];

export const documentsHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "File" },
	{ label: "Size" },
	{ label: "Caption" },
	{ label: "Table" },
	{ label: "Type" },
	{ label: "Date" },
	{ label: "View" },
	{ label: "" }, //edit icon
];

export const ImpactHeadings: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Category" },
	{ label: "Target", keyMapping: "target_value" },
	{ label: "Achieved" },
	{ label: "Progess" },
	{ label: "SDG" },
	{ label: "" }, //edit icon
];

export const invitedUserTableHeadings = [
	{ label: "#" },
	{ label: "Email", keyMapping: "email" },
	{ label: "Role", keyMapping: "role" },
	{ label: "Confirmed" },
	{ label: "Projects" },
	{ label: "" }, //edit icon
];
export const deliverableAndimpactTracklineHeading: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Date", keyMapping: "reporting_date" },
	{ label: "Note", keyMapping: "note" },
	{ label: "Value", keyMapping: "value" },
	{ label: "Year" },
	{ label: "TimePeriod" },
	{ label: "" }, //edit icon
];

export const budgetTargetTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Target Name", keyMapping: "name" },
	{ label: "Budget Category" },
	{ label: "Donor" },
	{ label: "Total Amount", keyMapping: "total_target_amount" },
	{ label: "Spent" },
	{ label: "Balance" },
	{ label: "Progress %" },
	{ label: "" },
];
export const subTargetTableHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Sub Target", keyMapping: "name" },
	{ label: "Target Value", keyMapping: "target_value" },
	{ label: "Time Period", keyMapping: "timeperiod_start" },
	{ label: "Years", keyMapping: "financial_year_donor" },
	{ label: "Tranche", keyMapping: "donor" },
	{ label: "Line Items" },
	{ label: "" }, //edit icon
];

export const budgetLineItemTableHeading: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Report Date", keyMapping: "reporting_date" },
	{ label: "Note", keyMapping: "note" },
	{ label: "Amount", keyMapping: "amount" },
	{ label: "Year" },
	{ label: "TimePeriod " },
	{ label: "" },
];

export const donorTableHeading = [
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Legal Name", keyMapping: "legal_name" },
	{ label: "Short Name", keyMapping: "short_name" },
	{ label: "Country" },
];

export const budgetCategoryHeading = [
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
];
export const geoRegionsHeading = [
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Description", keyMapping: "description" },
	// { label: "See Georegions" },
	{ label: "" },
];

export const deliverableCategoryTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Deliverable Category", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
];

export const GeographiesCountryTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	// { label: "Parent" },
	{ label: "" },
];
export const GeographiesStateTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Country" },
	{ label: "" },
];
export const GeographiesDistrictTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "State" },
	{ label: "" },
];
export const GeographiesBlockTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "District" },
	{ label: "" },
];
export const GeographiesGrampanchayatTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "District" },
	{ label: "" },
];
export const GeographiesVillageTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Block" },
	{ label: "" },
];

export const TallyMapperCostcenterTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "Sr. No." },
	{ label: "Tally ID", keyMapping: "tally_id" },
	{ label: "Cost Center", keyMapping: "costcenter" },
	{ label: "Donor", keyMapping: "donor" },
	{ label: "Project", keyMapping: "project" },
	{ label: "Target", keyMapping: "target" },
	{ label: "Sub-Target", keyMapping: "subtarget" },
	{ label: "Category", keyMapping: "category" },
	{ label: "Status", keyMapping: "status" },
	{ label: "" },
];
export const TallyMapperCategoriesTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "Sr. No." },
	{ label: "Tally ID", keyMapping: "tally_id" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Cost Categories", keyMapping: "costcategories" },
	{ label: "Donor", keyMapping: "donor" },
	{ label: "Project", keyMapping: "project" },
	{ label: "Target", keyMapping: "target" },
	{ label: "Sub-Target", keyMapping: "subtarget" },
	{ label: "Category", keyMapping: "category" },
	{ label: "Status", keyMapping: "status" },
	{ label: "" },
];
export const TallyMapperLedgerTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "Sr. No." },
	{ label: "Tally ID", keyMapping: "tally_id" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Cost Ledger", keyMapping: "costledger" },
	{ label: "Donor", keyMapping: "donor" },
	{ label: "Project", keyMapping: "project" },
	{ label: "Target", keyMapping: "target" },
	{ label: "Sub-Target", keyMapping: "subtarget" },
	{ label: "Category", keyMapping: "category" },
	{ label: "Status", keyMapping: "status" },
	{ label: "" },
];
export const TallyMapperLedgerGroupTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "Sr. No." },
	{ label: "Tally ID", keyMapping: "tally_id" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Cost Ledger Group", keyMapping: "costledgergroup" },
	{ label: "Donor", keyMapping: "donor" },
	{ label: "Project", keyMapping: "project" },
	{ label: "Target", keyMapping: "target" },
	{ label: "Sub-Target", keyMapping: "subtarget" },
	{ label: "Category", keyMapping: "category" },
	{ label: "Status", keyMapping: "status" },
	{ label: "" },
];
export const TallyMapperVoucherTableHeading: ITableHeadings[] = [
	{ label: "" },
	{ label: "Sr. No." },
	{ label: "Tally ID", keyMapping: "tally_id" },
	// { label: "ID", keyMapping: "id" },
	{ label: "Cost Voucher", keyMapping: "costvoucher" },
	{ label: "Donor", keyMapping: "donor" },
	{ label: "Project", keyMapping: "project" },
	{ label: "Target", keyMapping: "target" },
	{ label: "Sub-Target", keyMapping: "subtarget" },
	{ label: "Category", keyMapping: "category" },
	{ label: "Status", keyMapping: "status" },
	{ label: "" },
];

export const deliverableUnitTableHeadings: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Deliverable Unit", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
];

export const impactUnitTableHeadings: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Impact Unit", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
];

export const impactCategoryTableHeadings: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Impact Category", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
];

export const fundReceivedTableHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Date", keyMapping: "reporting_date" },
	{ label: "Amount", keyMapping: "amount" },
	{ label: "Donor" },
	{ label: "" },
];

export const individualTableProjectHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "" },
];

export const individualTableOrganizationHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Projects" },
	{ label: "" },
	{ label: "" },
];

export const contactTableHeadings: ITableHeadings[] = [
	{ label: "" },
	{ label: "#" },
	{ label: "Email", keyMapping: "email" },
	{ label: "Email Other", keyMapping: "email_other" },
	{ label: "Phone", keyMapping: "phone" },
	{ label: "Phone Other", keyMapping: "phone_other" },
	{ label: "Contact Type", keyMapping: "contact_type" },
	{ label: "" },
	{ label: "" },
];

export const addressTableHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Address Line 1" },
	{ label: "Address Line 2" },
	{ label: "Pincode" },
	{ label: "City" },
	{ label: "Address Type" },
	{ label: "" },
	{ label: "" },
];

export const yearTagTableHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Label", keyMapping: "name" },
	{ label: "Type", keyMapping: "type" },
	{ label: "Start Date", keyMapping: "start_date" },
	{ label: "End Date", keyMapping: "end_date" },
	{ label: "Countries" },
];
