import { FORM_ACTIONS } from "./constants";
import { IOrganisation } from "./organisation/types";
import { IProject } from "./project/project";
import React, { MutableRefObject, ReactNode } from "react";

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

export interface IDialogContext {
	component: React.ReactNode | undefined;
}

export interface IOrganizationCurrency {
	id: string;
	currency: {
		name: string;
	};
}

export interface IInputField {
	inputType?: string;
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
	size?: any;
	required?: boolean;
	position?: string;
	disabled?: boolean;
}
export interface IGeoregionInputField {
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
	optionsArray?: any[];
	getInputValue?: any;
	multiple?: boolean;
	hidden?: boolean;
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
	addNew?: boolean;
	addNewClick?: any;
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
	buttons?: any;
	children?: any;
}

export interface ICountry {
	id: string;
	name: string;
}

//change type here
export type ICommonTableRow = {
	valueAccessKey: string;
	renderComponent?: (props: any) => React.ReactNode;
};

export interface ICommonTable<T> {
	tableHeadings: ITableHeadings[];
	rows: ICommonTableRow[];
	selectedRow: MutableRefObject<T | null>;
	children: ReactNode | [ReactNode, () => ReactNode];
	valuesList: T[];
	toggleDialogs: (index: number, val: boolean) => void;
	editMenuName: string[];
	collapsableTable?: boolean;
	changePage?: (prev?: boolean) => void;
	count?: number;
	loading?: boolean;
	order?: "asc" | "desc";
	setOrder?: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy?: string;
	setOrderBy?: React.Dispatch<React.SetStateAction<string>>;
	setOpenAttachFiles?: React.Dispatch<React.SetStateAction<any>>;
	tableActionButton?: ({
		importButtonOnly,
	}: {
		importButtonOnly?: boolean;
	}) => React.ReactElement;
}

export interface ITableHeadings {
	label: string;
	keyMapping?: string;
	renderComponent?: () => React.ReactNode;
}
