import { IOrganisation, IOrganizationRegistrationType, IOrganisationForm } from "./types";

export interface IOrganisationFetchResponse {
	organization: IOrganisation;
}

export interface IUpdateOrganization {
	organizationUpdate: IOrganisation;
}

export interface IUpdateOrganizationVariables {
	id: string;
	input: IOrganisationForm;
}

export interface IGetOrganizationRegistrationType {
	organizationRegistrationTypes: IOrganizationRegistrationType[];
}
