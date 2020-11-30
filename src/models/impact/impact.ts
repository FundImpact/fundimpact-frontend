import { FORM_ACTIONS } from "../constants";
import { IImpactUnitFormInput } from "./impactForm";

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
}

export interface IImpactUnitData extends Omit<IImpactUnit, "id"> {
	id: string;
}

export type IImpactCategoryProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IImpactCategory;
			organization?: string | number;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IImpactCategory;
			organization?: string | number;
	  };

export type IImpactUnitProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IImpactUnitFormInput;
			organization?: string | number;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IImpactUnitFormInput;
			organization?: string | number;
	  };
