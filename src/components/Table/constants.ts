import { ITableHeadings } from "../../models";

export const deliverableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Name", keyMapping: "name" },
	{ label: "Category" },
	{ label: "Target", keyMapping: "target_value" },
	{ label: "Achieved" },
	{ label: "Progess" },

	{ label: "" }, //edit icon
];

export const ImpactHeadings = [
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
	{ label: "" }, //edit icon
];
export const deliverableAndimpactTracklineHeading = [
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
	{ label: "Country" },
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

export const deliverableCategoryTableHeading = [
	{ label: "" },
	{ label: "#" },
	{ label: "Deliverable Category", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
	{ label: "" },
];

export const deliverableUnitTableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Deliverable Unit", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
	{ label: "" },
];

export const impactUnitTableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Impact Unit", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
	{ label: "" },
];

export const impactCategoryTableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Impact Category", keyMapping: "name" },
	{ label: "Code", keyMapping: "code" },
	{ label: "Description", keyMapping: "description" },
	{ label: "Used in projects" },
	{ label: "" },
	{ label: "" },
];
