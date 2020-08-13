import { IProject } from "./project/project";

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
	name?: string;
	id?: string;
}

export interface IBasicInformation {
	email: string;
	password: string;
	confirmPassword: string;
	provider: "local";
	organization: {
		name: string;
		short_name?: string;
		legal_name?: string;
		description?: string;
		type?: string;
	};
}

export interface ILoginForm {
	email: String;
	password: String;
}

export interface IAlertMsg {
	severity?: "success" | "info" | "warning" | "error";
	msg: string;
}

export interface IDashboardDataContext {
	project?: IProject;
	organization?: IOrganisation;
	workspace?: any;
}

export interface IOrganizationCurrency {
	id: string;
	currency: {
		name: string;
	};
}
