import { IInputFields } from "..";

export interface IOrganisationType {
	id: string;
	reg_type: string;
}

export interface IOrganisation {
	__typename: string;
	id: string;
	name: string;
	short_name: string;
	organization_registration_type: IOrganisationType;
	country?: { id: string; name: string };
	legal_name: string;
	logo?: {
		id: string;
		url: string;
	};
}

export interface IOrganisationForm
	extends Omit<
		IOrganisation,
		"__typename" | "organization_registration_type" | "country" | "logo"
	> {
	organization_registration_type: string;
	country: string;
	icon: File | string;
	logo?: string;
}

export interface IOrganisation {
	__typename: string;
	id: string;
	name: string;
	short_name: string;
	organization_registration_type: IOrganisationType;
	country?: { id: string; name: string };
	account?: {
		id: string;
		name: string;
		description: string;
		account_no: string;
	};
	legal_name: string;
	logo?: {
		id: string;
		url: string;
	};
}

export interface IOrganisationForm
	extends Omit<
		IOrganisation,
		"__typename" | "organization_registration_type" | "country" | "logo"
	> {
	organization_registration_type: string;
	country: string;
	icon: File | string;
	logo?: string;
}

export interface IOrganizationCurrency {
	id: string;
	isHomeCurrency: boolean;
	currency: {
		id: string;
		name: string;
		code: string;
	};
}

export interface IOrganizationRegistrationType {
	id: string;
	reg_type: string;
}

export interface IOrganizationInputFields extends IInputFields {
	helperText?: string;
	displayName?: string;
}

export interface IOrganizationRegistrationType {
	id: string;
	reg_type: string;
}

export interface IOrganizationInputFields extends IInputFields {
	helperText?: string;
	displayName?: string;
}
