export interface ISignUpStep {
	label: string;
	id: string;
	step: number;
	description?: string;
}

export interface IUserSignUp {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface IOrganisation {
	orgName: string;
	streetAdd: string;
	city: string;
	state: string;
	country: string;
	zipCode: number | null;
}

export interface IBasicInformation {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
	provider: "local";
	organisation: {
		name: string;
		short_name: string;
		legal_name: string;
		description: string;
		type: string;
	};
}

export interface ILoginForm {
	identifier?: String;
	password?: String;
}
