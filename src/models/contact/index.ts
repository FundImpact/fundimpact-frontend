//remove optional from name and contact type
export interface IContactForm {
	name?: string;
	phone: string;
	phone_other: string;
	email: string;
	email_other: string;
	contact_type?: string;
}
