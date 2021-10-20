import { ISelectField } from "../../../models";
import { FORM_ACTIONS } from "../constant";

export interface ITallyInputFields {
	inputType: string;
	name: string;
	label: string;
	testId: string;
	dataTestId: string;
	id: string;
	multiline?: boolean;
	rows?: number;
	formik?: any;
	type?: string;
	size?: any;
	optionsLabel?: string;
	optionsArray?: any[];
	secondOptionsArray?: any[];
	secondOptionsLabel?: string;
	customMenuOnClick?: any;
	inputLabelId?: string;
	selectLabelId?: string;
	selectId?: string;
	getInputValue?: any;
	required?: boolean;
	multiple?: boolean;
	hidden?: boolean;
	logo?: string;
	disabled?: boolean;
	onClick?: (() => void) | null;
	textNextToButton?: string;
	autoCompleteGroupBy?: <T>(option: T) => string;
	addNew?: boolean;
	addNewClick?: (() => void) | null;
	helperText?: string | React.ReactNode;
	position?: string;
}

export interface ITallyForm {
	validate: any;
	onSubmit: any;
	onCancel: () => void;
	onUpdate?: any;
	inputFields: ITallyInputFields[];
	initialValues: any;
	selectFields?: ISelectField[];
	children?: React.ReactNode;
	formAction?: FORM_ACTIONS;
	buttons?: any;
}
