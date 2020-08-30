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
	country: {
		id: string;
	};
}
