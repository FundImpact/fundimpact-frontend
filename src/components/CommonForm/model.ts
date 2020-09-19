export interface ICommonForm {
	initialValues: any;
	validate: (initialValue: any) => object;
	onCreate: (values: any) => void;
	onUpdate: (values: any) => void;
	onCancel?: () => void;
	inputFields: any[];
	formAction: any;
	cancelButtonName?: string;
}
