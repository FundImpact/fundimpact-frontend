import { MODULE_CODES } from "../../utils/access";

export type IAddRolePermissions = {
	[key in MODULE_CODES]: {
		[key: string]: boolean;
	};
};

export interface IAddRole {
	name: string;
	permissions: IAddRolePermissions | {};
	is_project_level: boolean;
}

export type IControllerAction = {
	[key in MODULE_CODES]: {
		[key: string]: {
			enabled: boolean;
			policy: "";
		};
	};
};

export interface IPermissionList {
	permissions: {
		application: {
			controllers: IControllerAction;
		};
	};
}
