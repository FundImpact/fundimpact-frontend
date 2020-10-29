//remove optional from name and contact type
export interface ICreateContactVariables {
	input: {
		data: {
			entity_name: string;
			entity_id: string;
			phone: string;
			phone_other?: string;
			email: string;
			email_other?: string;
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
