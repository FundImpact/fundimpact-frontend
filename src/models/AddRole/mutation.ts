import { IAddRole, IControllerAction } from ".";

export interface ICreateOrganizationUserRole {
	createOrganizationUserRole: { id: string; name: string };
}

export interface IUpdateOrganizationUserRole {
	updateOrganizationUserRole: {
		id: string;
		name: string;
		permissions: {
			id: string;
			controller: string;
			action: string;
			enabled: boolean;
		}[];
	};
}

export interface ICreateOrganizationUserRoleVariables {
	id: string;
	input: {
		name: string;
		permissions: {
			application: {
				controllers: IControllerAction | {};
			};
			upload: {
				controllers: IControllerAction | {};
			};
			userspermissions: {
				controllers: IControllerAction | {};
			};
		};
		is_project_level: boolean;
	};
}

export interface IUpdateOrganizationUserRoleVariables {
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
