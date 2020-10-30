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
	{ label: "Achieved", keyMapping: "value" },
	{ label: "Year" },
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
	{ label: "Progress %" },
	{ label: "" },
];

export const budgetLineItemTableHeading: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Date", keyMapping: "reporting_date" },
	{ label: "Note", keyMapping: "note" },
	{ label: "Amount", keyMapping: "amount" },
	{ label: "Grant Period" },
	{ label: "Year" },
	{ label: "" },
];

export const donorTableHeading = [
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Legal Name", keyMapping: "legal_name" },
	{ label: "Short Name", keyMapping: "short_name" },
	{ label: "Currency" },
	{ label: "" },
];

export const budgetCategoryHeading = [
	{ label: "#" },
	{ label: "Budget Category", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
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
	{ label: "" },
];

export const fundReceivedTableHeadings: ITableHeadings[] = [
	{ label: "#" },
	{ label: "Date", keyMapping: "reporting_date" },
	{ label: "Amount", keyMapping: "amount" },
	{ label: "Donor" },
	{ label: "" },
];

export const individualTableHeadings: ITableHeadings[] = [
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
