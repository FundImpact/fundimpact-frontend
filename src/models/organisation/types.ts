import { IInputFields } from "..";
import { ThemeOptions } from "@material-ui/core";
import { DELIVERABLE_TYPE } from "../constants";

export interface IOrganisationType {
	id: string;
	reg_type: string;
}

export interface IOrganisation {
	id: string;
	name: string;
	short_name: string;
	organization_registration_type: IOrganisationType;
	country?: { id: string; name: string };
	deliverable_type?: {
		types: DELIVERABLE_TYPE[];
	};
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
	theme: ThemeOptions;
	currency: { id: string };
}

export interface IOrganisationForm
	extends Omit<
		IOrganisation,
		"__typename" | "organization_registration_type" | "country" | "logo" | "id" | "currency"
	> {
	organization_registration_type?: string;
	country: string;
	logo?: string | File;
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
