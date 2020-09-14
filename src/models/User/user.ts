import { FORM_ACTIONS } from "../../components/Forms/constant";

interface ProfilePhoto {
	id: string;
	url: string;
}
export interface IUser {
	id?: string | number;
	username: string;
	email: string;
	name: string;
	profile_photo?: ProfilePhoto;
	uploadPhoto: string;
	logo?: string;
}

export type UserProps =
	| {
			type: FORM_ACTIONS.CREATE;
	  }
	| {
			type: FORM_ACTIONS.UPDATE;
			data: IUser;
	  };
