export const projectsMock = {
	id: 2,
	name: "Project1s",
	short_name: "",
	description: "",
};
export const DeliverableTargetMock = [
	{
		id: "1",
		name: "Test Deliverable Target",
		description: "This is a sample deliverable",
		target_value: 50000,
		deliverable_category_unit: {
			id: "15",
			deliverable_category_org: {
				id: "8",
				name: "JUKEBOX",
				code: "JB",
				description: "Deliverable Category description",
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
			deliverable_units_org: {
				id: "8",
				name: "unit",
				description: "This is a sample deliverable",
				code: "BB",
				unit_type: "BB",
				prefix_label: "XX",
				suffix_label: "YY",
			},
		},
		project: {
			id: "2",
			name: "Project1ssssss",
			short_name: "",
			description: "",
		},
	},
];

export const achieveValueMock = 25000;

export const DeliverableTracklineByTargetMock = [
	{
		id: "2",
		value: 25000,
		note: "this is a note",
		reporting_date: "2020-08-25T00:00:00.000Z",
		deliverable_target_project: DeliverableTargetMock,
		project: {
			id: "2",
			name: "Project1s",
			short_name: "",
			description: "",
		},
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
	},
];
export const DeliverableTracklineMock = {
	deliverable_target_project: "1",
	id: 1,
	value: 25000,
	note: "this is a note",
	annual_year: "1",
	reporting_date: "2020-08-25T00:00:00.000Z",
};

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

export const deliverableCategoryMock = [
	{
		id: "1",
		name: "new Cat",
		description: "xxxxx",
		code: "xxx",
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
	{
		id: "30",
		name: "MyCategory",
		description: "xxxxxxxx",
		code: "xx",
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
];

export const deliverableCategoryUnitListMock = [
	{
		id: "1",
		deliverable_category_org: {
			id: "6",
			name: "SONG",
			description: null,
			code: null,
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
		deliverable_units_org: {
			id: "1",
			name: "FREEVERSE FEAST",
			description: null,
			code: null,
			unit_type: null,
			prefix_label: null,
			suffix_label: null,
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
];

export const deliverableLineitemFyDonorListMock = [
	{
		id: "17",
		deliverable_tracking_lineitem: DeliverableTracklineByTargetMock[0],
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
				},
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
		financial_year: {
			id: "1",
			name: "FY 2019-20",
			short_name: "FY2019-20",
			start_date: "2019-04-01T06:30:00.000Z",
			end_date: "2020-03-31T06:30:00.000Z",
			country: {
				id: "1",
			},
		},
	},
];
