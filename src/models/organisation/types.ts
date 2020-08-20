export interface IOrganisationType {
	created_at: string;
	id: number;
	reg_type: string;
	updated_at: string;
}

export interface IOrganisation {
	__typename: string;
	id: string;
	name: string;
}
