import { FORM_ACTIONS } from "../constants";

export interface YearTagPayload {
	id: string;
	type: "annual" | "financial";
	start_date: Date;
	end_date: Date;
	__typename?: string;
}

export interface IYearTag {
	id?: string;
	name: string;
	type: "annual" | "financial";
	start_date: Date;
	end_date: Date;
	__typename?: string;
}

export type IYearTagProps = {
	open: boolean;
	handleClose: () => void;
	formAction: FORM_ACTIONS.UPDATE | FORM_ACTIONS.CREATE;
	initialValues?: IYearTag;
	deleteYearTag?: boolean;
};
