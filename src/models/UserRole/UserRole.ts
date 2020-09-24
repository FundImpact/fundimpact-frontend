import { FORM_ACTIONS } from "../../components/Forms/constant";

export interface IUserRole {
	id?: string | number;
	email: string;
	role: string;
}

export type UserRoleProps =
	| {
			type: FORM_ACTIONS.CREATE;
	  }
	| {
			type: FORM_ACTIONS.UPDATE;
			data: IUserRole;
	  };
