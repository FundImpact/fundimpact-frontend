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

interface Name {
	firstName: string;
	surname: string;
}

export interface IContactForm {
	name: Name[];
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
}

export type IContactInputElements = {
	icon: JSX.Element;
	inputsGroup: {
		label: string;
		size: 6 | 12;
		id: string;
		initialValue: string;
		required: boolean;
	}[];
	showAddIcon: boolean;
	id: string;
	fullWidth?: boolean;
}[];
