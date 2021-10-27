export const sidebarList: {
	mainHeading: string;
	subHeadings: { to: string; dataTestId: string; title: string; userAccess: boolean }[];
}[] = [
	{
		mainHeading: "",
		subHeadings: [
			{
				to: "organization",
				dataTestId: "organization-link",
				title: "Organization Info",
				userAccess: true,
			},
			{
				to: "documents",
				dataTestId: "organization-Documents",
				title: "Organization Documents",
				userAccess: true,
			},
			{
				to: "individual",
				dataTestId: "individual-link",
				title: "Individual",
				userAccess: true,
			},
		],
	},

	{
		mainHeading: "Manage Portal",
		subHeadings: [
			{
				to: "donors",
				dataTestId: "donor-link",
				title: "Manage Donors",
				userAccess: true,
			},
		],
	},
	{
		mainHeading: "Manage Masters",
		subHeadings: [
			{
				to: "budget",
				dataTestId: "budget-category-link",
				title: "Budget Categories",
				userAccess: true,
			},
			{
				to: "categories",
				dataTestId: "categories-link",
				title: "Categories",
				userAccess: true,
			},
			{
				to: "units",
				dataTestId: "units-link",
				title: "Units",
				userAccess: true,
			},
			{
				to: "impact",
				dataTestId: "impact-category-link",
				title: "Impact Categories And Units",
				userAccess: true,
			},
			{
				to: "deliverable",
				dataTestId: "deliverable-category-link",
				title: "Deliverable Categories And Units",
				userAccess: true,
			},
			{
				to: "georegions",
				dataTestId: "geo-regions-link",
				title: "Geo Regions",
				userAccess: true,
			},
			{
				to: "yeartags",
				dataTestId: "yeartags-link",
				title: "Year Tags",
				userAccess: true,
			},
			{
				to: "tally",
				dataTestId: "tally-link",
				title: "Tally Masters",
				userAccess: true,
			},
		],
	},
	{
		mainHeading: "Manage Users",
		subHeadings: [
			{ to: "users", dataTestId: "users-link", title: "Users", userAccess: true },
			// { to: "user_roles", dataTestId: "user-role-link", title: "Roles", userAccess: true },
		],
	},
];
