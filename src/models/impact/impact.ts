import { FORM_ACTIONS } from "../constants";

export interface IImpactCategory {
	name: string;
	shortname: string;
	code: string;
	description: string;
	id?: string;
}

export interface IImpactCategoryData extends Omit<IImpactCategory, "id"> {
	id: string;
}

export interface IImpactUnit {
	id?: string;
	name: string;
	description: string;
	code: string;
	target_unit: number;
	prefix_label: string;
	suffix_label: string;
	impactCategory: string;
}

export type IImpactCategoryProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IImpactCategory;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IImpactCategory;
	  };
