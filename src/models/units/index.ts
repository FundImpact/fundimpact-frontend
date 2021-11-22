import { FORM_ACTIONS } from "../constants";

export interface UnitPayload {
	id: string;
	type: "annual" | "financial";
	start_date: Date;
	end_date: Date;
	__typename?: string;
}

export interface IUnits {
	id?: string;
	name: string;
	code: string | null;
	description: string | null;
	project_id?: string;
	deliverable_type_id?: DeliverableType | null;
	type?: string;
	is_project?: boolean;
}

export type ProjectId = {
	id: string;
	name: string;
};

export type DeliverableType = {
	id?: string;
	name: string;
};

export type IUnitProps = {
	open: boolean;
	handleClose: () => void;
	formAction: FORM_ACTIONS.UPDATE | FORM_ACTIONS.CREATE;
	initialValues?: IUnits;
	deleteUnit?: boolean;
};
