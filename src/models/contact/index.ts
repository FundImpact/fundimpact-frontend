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

export type IContactInputElements = {
	icon: JSX.Element;
	inputs: {
		label: string;
	}[];
	showAddIcon: boolean;
	numberOfTimeToReplicate: number;
	fullWidth?: boolean;
}[];
