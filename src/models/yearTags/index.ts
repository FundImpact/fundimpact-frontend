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
	type: "annual" | "financial" | "";
	start_date: Date | string;
	end_date: Date | string;
	__typename?: string;
	country_id?: string[];
}

export type IYearTagProps = {
	open: boolean;
	handleClose: () => void;
	formAction: FORM_ACTIONS.UPDATE | FORM_ACTIONS.CREATE;
	initialValues?: IYearTag;
	deleteYearTag?: boolean;
};

export interface ITablesDialogProps {
	open: boolean;
	handleClose: () => void;
	yearTag?: IYearTag;
}

export type IYearTagCountry = {
	__typename?: string;
	id: string;
	country: ICountry;
	year_tag?: {
		__typename?: string;
		id: string;
		name: string;
	};
};

export type ICountry = {
	__typename?: string;
	id: string;
	name: string;
	code: string | null;
};
