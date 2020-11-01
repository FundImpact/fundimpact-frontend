import { IOrganisation, IOrganizationRegistrationType, IOrganisationForm } from "./types";

export interface IOrganisationFetchResponse {
	organization: IOrganisation;
}

export interface IUpdateOrganization {
	organizationUpdate: IOrganisation;
}

export interface IUpdateOrganizationVariables {
	input: {
		where: {
			id: string;
		};
		data: IOrganisationForm;
	};
}

export interface IGetOrganizationRegistrationType {
	organizationRegistrationTypes: IOrganizationRegistrationType[];
}
