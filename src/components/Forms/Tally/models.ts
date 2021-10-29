import { ISelectField, IInputFields } from "../../../models";
import { FORM_ACTIONS } from "../constant";

export interface ITallyForm {
	validate: any;
	onSubmit: any;
	onCancel: () => void;
	onUpdate?: any;
	inputFields: IInputFields[];
	initialValues: any;
	selectFields?: ISelectField[];
	children?: React.ReactNode;
	formAction?: FORM_ACTIONS;
	buttons?: any;
}
