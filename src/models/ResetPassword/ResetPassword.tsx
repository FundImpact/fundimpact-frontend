import { FORM_ACTIONS } from "../../components/Forms/constant";

export interface IPassword {
	password: string;
	passwordConfirmation: string;
}

export type ResetPasswordProps = {
	type: FORM_ACTIONS.UPDATE;
	userId: string;
};
