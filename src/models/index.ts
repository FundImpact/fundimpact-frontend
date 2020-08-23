import { IProject } from "./project/project";
import { FORM_ACTIONS } from "./budget/constants";

export interface ISignUpStep {
	label: string;
	id: string;
	step: number;
	description?: string;
}

export interface IUserSignUp {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface IOrganisation {
	orgName: string;
	streetAdd: string;
	city: string;
	state: string;
	country: string;
	zipCode: number | null;
	name?: string;
	id?: string;
}

export interface IBasicInformation {
	email: string;
	password: string;
	confirmPassword: string;
	provider: "local";
	organization: {
		name: string;
		short_name?: string;
		legal_name?: string;
		description?: string;
		type?: string;
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
}

export interface ICommonDialog {
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
