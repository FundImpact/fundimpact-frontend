import { FORM_ACTIONS } from "../constants";

export interface CategoryPayload {
	id: string;
	type: "annual" | "financial";
	start_date: Date;
	end_date: Date;
	__typename?: string;
}

export interface ICategory {
	id?: string;
	name: string;
	code: string | null;
	description: string | null;
	type: string | null;
	is_project: boolean;
	project_id?: string;
	// project_id?: ProjectId | number;
	deliverable_type_id?: DeliverableType | null;
}

export type ProjectId = {
	id: string;
	name: string;
};

export type DeliverableType = {
	id?: string;
	name: string;
};

export type ICategoryProps = {
	open: boolean;
	handleClose: () => void;
	formAction: FORM_ACTIONS.UPDATE | FORM_ACTIONS.CREATE;
	initialValues?: ICategory;
	deleteCategory?: boolean;
};
