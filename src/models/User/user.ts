import { FORM_ACTIONS } from "../../components/Forms/constant";

export interface IUser {
	id?: string | number;
	username?: string;
	password?: string;
	email: string;
	name: string;
	profile_photo?: string;
	uploadPhoto: string;
	logo?: string;
	theme: any;
	language: string;
}

export type UserProps =
	| {
			type: FORM_ACTIONS.CREATE;
	  }
	| {
			type: FORM_ACTIONS.UPDATE;
			updateWithToken?: boolean;
			data: IUser;
	  };
