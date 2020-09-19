import { FORM_ACTIONS } from "./constants";
import { IOrganisation } from "./organisation/types";
import { IProject } from "./project/project";

export interface ISignUpStep {
	label: string | JSX.Element;
	id: string;
	step: number;
	description?: string | JSX.Element;
}

export interface IUserSignUp {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

// export interface IOrganisation {
// 	id?: string;
// 	orgName: string;
// 	streetAdd: string;
// 	city: string;
// 	state: string;
// 	country: string;
// 	zipCode: number | null;
// 	name?: string;
// }

export interface IBasicInformation {
	email: string;
	password: string;
	provider: "local";
	organization: {
		name: string;
		short_name?: string;
		legal_name?: string;
		description?: string;
		type?: string;
		country: string;
	};
}

export interface ILoginForm {
	email: String;
	password: String;
}

export interface IAlertMsg {
	severity?: "success" | "info" | "warning" | "error";
	msg: string;
}

export interface IDashboardDataContext {
	project?: IProject;
	organization?: IOrganisation;
	workspace?: any;
}

export interface INotificationContext {
	successNotification: string;
	errorNotification: string;
}

export interface IOrganizationCurrency {
	id: string;
	currency: {
		name: string;
	};
}

export interface IInputField {
	name: string;
	label: string;
	testId: string;
	dataTestId: string;
	id: string;
	multiline?: boolean;
	rows?: number;
	endAdornment?: string;
	formik?: any;
	type?: string;
	size: any;
	required?: boolean;
}

export interface IInputFields {
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
	optionsArray?: any[];
	inputLabelId?: string;
	selectLabelId?: string;
	selectId?: string;
	getInputValue?: any;
	required?: boolean;
	multiple?: boolean;
	hidden?: boolean;
	logo?: string;
}

export interface ISelectField {
	name: string;
	label: string;
	testId: string;
	dataTestId: string;
	formik?: any;
	optionsArray: any[];
	inputLabelId: string;
	selectLabelId: string;
	selectId: string;
	size: any;
	hidden?: boolean;
	displayName?: string;
	required?: boolean;
}

export interface IFormDialog {
	open: boolean;
	handleClose: () => void;
	loading: boolean;
	title: string;
	subtitle: string;
	workspace: string;
	project: string;
	onUpdate?: any;
	children: React.ReactNode;
}

export interface ICommonForm {
	validate: any;
	onSubmit: any;
	onCancel: () => void;
	onUpdate?: any;
	inputFields: IInputField[];
	selectFields?: ISelectField[];
	initialValues: any;
	formAction?: FORM_ACTIONS;
}

export interface ICountry {
	id: string;
	name: string;
}
export type ICommonTableRow = {
	valueAccessKey: string;
	renderComponent?: (id: string) => React.ReactNode;
};
