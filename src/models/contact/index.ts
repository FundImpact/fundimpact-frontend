export interface IContactForm {
	phone: string;
	phone_other: string;
	email: string;
	email_other: string;
	contact_type: string;
}

export interface IContact {
	id: string;
	phone: string;
	phone_other: string;
	email: string;
	email_other: string;
	contact_type: string;
}
export type IContactInputElement = {
	icon: JSX.Element;
	inputs: {
		label: string;
		size: 6 | 12;
		id: string;
	}[][];
	showAddIcon: boolean;
	id: string;
	numberOfTimeToReplicate: number;
	fullWidth?: boolean;
};
export type IContactInputElements = {
	icon: JSX.Element;
	inputs: {
		label: string;
		size: 6 | 12;
		id: string;
	}[][];
	showAddIcon: boolean;
	id: string;
	numberOfTimeToReplicate: number;
	fullWidth?: boolean;
}[];
