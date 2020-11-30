interface Email {
	label: string;
	value: string;
}

interface PhoneNumber {
	label: string;
	value: string;
}

interface Addresses {
	address_line_1: string;
	address_line_2: string;
	pincode: string;
	city: string;
}

interface Label {
	label: string;
}

export interface IContactForm {
	label: Label[];
	emails: Email[];
	phone_numbers: PhoneNumber[];
	addresses: Addresses[];
	contact_type: string;
}

export interface IContact {
	id: string;
	emails: Email[];
	phone_numbers: PhoneNumber[];
	addresses: Addresses[];
	contact_type: string;
	label: string;
}

export type IContactInputElements = {
	icon: JSX.Element;
	inputsGroup: {
		label: string;
		size: 6 | 12;
		id: string;
		initialValue: string;
		required: boolean;
		testId: string;
	}[];
	showAddIcon: boolean;
	id: string;
	fullWidth?: boolean;
}[];
