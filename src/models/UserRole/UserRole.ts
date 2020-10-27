import { FORM_ACTIONS } from "../../components/Forms/constant";

export interface IUserRole {
	id?: string | number;
	email: string;
	role: string;
	project?: { id: string; name: string; workspace: { id: string; name: string } }[];
}

export interface IUserRoleUpdate extends Omit<IUserRole, "project"> {
	project: {
		user_project_id: string;
		id: string;
		name: string;
		workspace: { id: string; name: string };
	}[];
}

export type UserRoleProps = {
	open: boolean;
	handleClose: () => void;
} & (
	| {
			type: FORM_ACTIONS.CREATE;
	  }
	| {
			type: FORM_ACTIONS.UPDATE;
			data: IUserRoleUpdate;
	  }
);
