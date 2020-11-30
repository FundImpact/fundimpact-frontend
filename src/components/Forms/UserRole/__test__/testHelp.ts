export const userListMock = [
	{
		id: "71",
		email: "romychawla@gmail.com",
		confirmed: true,
		blocked: null,
		role: {
			id: "39",
			name: "Admin",
			is_project_level: true,
			type: "admin",
			sequence: 2,
		},
		organization: {
			id: "58",
			name: "HISAAB KITAAB",
		},
		user_projects: [
			{
				id: "1",
				project: {
					id: "1",
					name: "build school",
					workspace: {
						id: "1",
						name: "education",
					},
				},
			},
		],
	},
];

export const rolesMock = [
	{
		id: "40",
		name: "Accountant",
		type: "accountant-org-58",
		is_project_level: false,
		description: "this is accountant role",
		organization: {
			id: "58",
			name: "HISAAB KITAAB",
		},
		sequence: 2,
	},
];
