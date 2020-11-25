import { FormikState } from "formik";

export interface ICommonForm {
	initialValues: any;
	validate: (initialValue: any) => object;
	onCreate: (
		values: any,
		{
			resetForm,
		}: {
			resetForm?: (nextState?: Partial<FormikState<any>> | undefined) => void;
		}
	) => void;
	onUpdate: (values: any) => void;
	onCancel?: () => void;
	inputFields: any[];
	formAction: any;
	cancelButtonName?: string;
	createButtonName?: string;
	updateButtonName?: string;
	children?: React.ReactNode;
}
