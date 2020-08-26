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
		reporting_date: "2020-08-25T00:00:00.000Z",
		impact_target_project: {
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
					name: "FREEVERSE",
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
		annual_year: {
			id: "2",
			name: "2015",
			short_name: "an",
			start_date: "2020-08-13T06:30:00.000Z",
			end_date: "2020-08-13T06:30:00.000Z",
		},
		financial_years_org: null,
		financial_years_donor: null,
		grant_periods_project: null,
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
