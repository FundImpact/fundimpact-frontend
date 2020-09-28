import { IAddRole } from ".";

export interface ICreateOrganizationUserRole {
	createOrganizationUserRole: { id: string; role: string };
}

export interface ICreateOrganizationUserRoleVariables {
	id: string;
	input: IAddRole;
}
