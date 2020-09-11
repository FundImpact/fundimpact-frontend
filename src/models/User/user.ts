import { FORM_ACTIONS } from "../../components/Forms/constant";

export interface IUser {
	id?: number;
	username: string;
	email: string;
	name: string;
}

export type UserProps =
	| {
			type: FORM_ACTIONS.CREATE;
	  }
	| {
			type: FORM_ACTIONS.UPDATE;
			data: IUser;
	  };
