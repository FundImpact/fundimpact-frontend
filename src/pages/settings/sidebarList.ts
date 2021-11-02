const manageMasterObject = [
	"budget",
	"categories",
	"units",
	"yeartags",
	"tally",
	"goeGraphies",
	"goeRegions",
	"tallyMapper",
];
const manageMasterSubHeadings = manageMasterObject.map((item) => ({
	to: item,
	dataTestId: item == "budget" ? "budget-category-link" : item + "-link",
	title: item.charAt(0).toUpperCase() + item.slice(1),
	userAccess: true,
}));
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
		subHeadings: manageMasterSubHeadings,
	},
	{
		mainHeading: "Manage Users",
		subHeadings: [
			{ to: "users", dataTestId: "users-link", title: "Users", userAccess: true },
			// { to: "user_roles", dataTestId: "user-role-link", title: "Roles", userAccess: true },
		],
	},
];
