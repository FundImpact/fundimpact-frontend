export interface IUserSignupResponse {
	jwt: string;
	user: {
		account: IUserAccount;

		blocked: any;
		confirmed: boolean;
		created_at: string;
		email: string;
		id: number;
		organisation: {
			account: IUserAccount;
			created_at: string;
			description: string;
			id: string;
			legal_name: string;
			name: string;
			organisation_registration_type: any;
			short_name: string;
			updated_at: string;
		};
	};

	role: IUserRole;
	provider: string;
	updated_at: string;
	username: string;
}

interface IUserAccount {
	account_no: string;
	created_at: string;
	description: string;
	id: number;
	name: string;
	updated_at: string;
}

interface IUserRole {
	description: string;
	id: number;
	name: string;
	type: string;
}
