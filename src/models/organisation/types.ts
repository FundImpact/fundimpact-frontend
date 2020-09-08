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
}

export interface IOrganisationForm
	extends Omit<IOrganisation, "__typename" | "organization_registration_type" | "country"> {
	organization_registration_type: string;
	country: string;
	icon: string;
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
