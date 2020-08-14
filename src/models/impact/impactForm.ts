import { IImpactCategory, IImpactUnit } from "./impact";

export interface IImpactCategoryFormProps {
	initialValues: IImpactCategory;
	onSubmit: (values: IImpactCategory) => void;
	validate: any;
	onCancel: () => void;
}


export interface IImpactUnitFormInput extends Omit<IImpactUnit, "target_unit"> {
	target_unit: string;
}

export interface IImpactUnitFormProps {
	initialValues: IImpactUnitFormInput;
	onSubmit: (values: IImpactUnitFormInput) => void;
	validate: any;
	onCancel: () => void;
}