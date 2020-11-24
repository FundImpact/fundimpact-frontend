import { Entity_Name } from "../constants";

export interface ICreateContactVariables {
	input: {
		data: {
			entity_name: string;
			entity_id: string;
			emails: { label: string; value: string }[];
			phone_numbers: { label: string; value: string }[];
			addresses: {
				address_line_1: string;
				address_line_2: string;
				pincode: string;
				city: string;
			}[];
			contact_type: string;
		};
	};
}

export interface IUpdateContactVariables {
	input: {
		where: {
			id: string;
		};
		data: {
			entity_name: string;
			entity_id: string;
			emails: { label: string; value: string }[];
			phone_numbers: { label: string; value: string }[];
			addresses: {
				address_line_1: string;
				address_line_2: string;
				pincode: string;
				city: string;
			}[];
			contact_type: string;
		};
	};
}

export interface ICreateContact {
	createT4DContact: {
		t4DContact: {
			id: string;
			email: string;
			email_other: string;
			phone: string;
			phone_other: string;
		};
	};
}

export interface IUpdateContact {
	updateT4DContact: {
		t4DContact: {
			id: string;
			email: string;
			email_other: string;
			phone: string;
			phone_other: string;
		};
	};
}

export interface IGetContact {
	t4DContacts: {
		id: string;
		name: string;
		emails: {
			label: string;
			value: string;
		}[];
		phone_numbers: {
			label: string;
			value: string;
		}[];
		addresses: {
			address_line_1: string;
			address_line_2: string;
			pincode: string;
			city: string;
			id: string;
		}[];
		contact_type: string;
		entity_id: string;
	}[];
}
