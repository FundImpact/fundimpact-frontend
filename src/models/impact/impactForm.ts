import { IImpactCategory, IImpactUnit } from "./impact";

export interface IImpactCategoryFormProps {
	initialValues: IImpactCategory;
	onSubmit: (values: IImpactCategory) => void;
	validate: any;
	onCancel: () => void;
}

export interface IImpactUnitFormInput
	extends Omit<IImpactUnit, "target_unit" | "prefix_label" | "suffix_label"> {
	target_unit: string;
	impactCategory?: string[];
	prefix_label?: string;
	suffix_label?: string;
}

export interface IImpactUnitFormProps {
	initialValues: IImpactUnitFormInput;
	onSubmit: (values: IImpactUnitFormInput) => void;
	validate: any;
	onCancel: () => void;
}
