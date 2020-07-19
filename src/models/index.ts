export interface ISignUpStep {
	label: string;
	id: string;
	step: number;
	description?: string;
}

export interface IBasicInformation {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface ILoginForm {
	userName?: String;
	password?: String;
}
