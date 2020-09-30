import { IAddRole, IControllerAction } from ".";

export interface ICreateOrganizationUserRole {
	createOrganizationUserRole: { id: string; name: string };
}

export interface ICreateOrganizationUserRoleVariables {
	id: string;
	input: {
		name: string;
		permissions: {
			application: {
				controllers: IControllerAction | {};
			};
		};
	};
}
