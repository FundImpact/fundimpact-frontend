export const projectMock = {
	id: 2,
	name: "Project1ssssss",
	short_name: "",
	description: "",
};
export const impactTargetMock = [
	{
		id: "14",
		name: "Impact TARGETcc",
		target_value: 2500000000,
		description: "This is a sample Impact TARGET",
		project: {
			id: "2",
			name: "Project1ssssss",
			short_name: "",
			description: "",
		},
		sustainable_development_goal: {
			id: "4",
			name: "Goal 3",
			short_name: "SDG",
			icon:
				"https://e7.pngegg.com/pngimages/863/694/png-clipart-person-holding-soil-and-plant-illustration-sustainable-agriculture-sustainability-computer-icons-agriculture-miscellaneous-leaf.png",
		},
		impact_category_unit: {
			id: "1",
			impact_category_org: {
				id: "2",
				name: "SONG",
				shortname: "IMORG",
				code: "ICO",
				description: "createImpactCategoryOrgInput",
				organization: {
					id: "2",
					name: "TSERIES",
					address: null,
					account: {
						id: "2",
						name: "rahul@gmail.com",
						description: null,
						account_no: "a8c1e362-405f-4572-a849-eb8094ffa550",
					},
					short_name: "TS",
					legal_name: "",
					description: null,
					organization_registration_type: {
						id: "1",
						reg_type: "Trusts",
					},
				},
			},
			impact_units_org: {
				id: "3",
				name: "units",
				description: "createImpactCategoryOrgInput",
				code: "ICO",
				target_unit: 2111,
				prefix_label: "",
				suffix_label: "",
				organization: {
					id: "2",
					name: "TSERIES",
					address: null,
					account: {
						id: "2",
						name: "rahul@gmail.com",
						description: null,
						account_no: "a8c1e362-405f-4572-a849-eb8094ffa550",
					},
					short_name: "TS",
					legal_name: "",
					description: null,
					organization_registration_type: {
						id: "1",
						reg_type: "Trusts",
					},
				},
			},
		},
	},
];

export const achieveValueMock = 630000;

export const impactTracklineByTargetMock = [
	{
		id: "8",
		value: 630000,
		note: "this is a note",
		reporting_date: "2020-08-26T00:00:00.000Z",
		impact_target_project: impactTargetMock[0],
		annual_year: {
			id: "2",
			name: "2015",
			short_name: "an",
			start_date: "2020-08-13T06:30:00.000Z",
			end_date: "2020-08-13T06:30:00.000Z",
		},
		financial_year: {
			id: "1",
			name: "FY 2019-20",
			short_name: "FY2019-20",
			start_date: "2019-04-01T06:30:00.000Z",
			end_date: "2020-03-31T06:30:00.000Z",
			country: {
				id: "1",
				name: "India",
			},
		},
		grant_periods_project: null,
		attachments: [],
	},
];

export const annualYearListMock = [
	{
		id: "1",
		name: "2016",
		short_name: "2016",
		start_date: "2016-01-01T06:30:00.000Z",
		end_date: "2016-12-31T06:30:00.000Z",
	},
	{
		id: "2",
		name: "2015",
		short_name: "an",
		start_date: "2020-08-13T06:30:00.000Z",
		end_date: "2020-08-13T06:30:00.000Z",
	},
];

export const impactLinitemFyDonorListMock = [
	{
		id: "1",
		impact_tracking_lineitem: impactTracklineByTargetMock[0],
		project_donor: {
			id: "1",
			project: {
				id: "21",
			},
			donor: {
				id: "1",
				name: "HUL",
				country: {
					id: "1",
					name: "India",
				},
			},
		},
		financial_year: {
			id: "1",
			name: "FY 2019-20",
			short_name: "FY2019-20",
			start_date: "2019-04-01T06:30:00.000Z",
			end_date: "2020-03-31T06:30:00.000Z",
			country: {
				id: "1",
				name: "India",
			},
		},
		grant_periods_project: {
			id: "1",
			name: "Quater 1",
			description: ": grant-periods-projectSsdsad",
			short_name: "g1",
			start_date: "2020-08-02T06:30:00.000Z",
			end_date: "2020-08-29T06:30:00.000Z",
			project: {
				id: "30",
				name: "HUL Food Drive 2020",
			},
		},
	},
];

export const impactCategoryMock = [
	{
		id: "1",
		name: "educated people",
		code: "edu code",
		description: "teaching poor student",
		shortname: "edu people",
	},
	{
		id: "2",
		name: "feed people",
		code: "feed code",
		description: "feed poor student",
		shortname: "fed pe",
	},
];

export const impactUnitMock = [
	{
		id: "1",
		name: "educated people",
		code: "edu code",
		description: "teaching poor student",
		shortname: "edu people",
		target_unit: "10123",
		prefix_label: "pre educate",
		suffix_label: "suf educate",
	},
	{
		id: "2",
		name: "feed people",
		code: "feed code",
		description: "feed poor student",
		shortname: "fed pe",
		target_unit: "123",
		prefix_label: "pre feed people",
		suffix_label: "suf feed people",
	},
];

export const impactCategoryUnit = [
	{
		id: "1",
		impact_category_org: impactCategoryMock[0],
		impact_units_org: impactUnitMock[0],
	},
	{
		id: "2",
		impact_category_org: impactCategoryMock[1],
		impact_units_org: impactUnitMock[1],
	},
];

export const impactCategoryUnitMock = [
	{
		id: "1",
		impact_category_org: impactCategoryMock[0],
		impact_units_org: impactUnitMock[0],
	},
];

export const sustainableDevelopmentGoalMock = [
	{
		id: "3",
		name: "Goal 3",
		short_name: "SDG",
		goal_no: 5,
		tags: "sdg",
		icon:
			"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngegg.com%2Fen%2Fpng-bizir&psig=AOvVaw0ZXn6uerGoiZ5amJfazrIv&ust=1599805392503000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKim1tX53esCFQAAAAAdAAAAABAK",
	},
];
