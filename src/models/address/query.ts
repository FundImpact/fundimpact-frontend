export interface ICreateAddressVariables {
	input: {
		data: {
			entity_name: string;
			entity_id: string;
			contact_id: string;
			address_line_1: string;
			address_line_2?: string;
			pincode: string;
			city: string;
			country: string;
			state: string;
			district: string;
			village: string;
			address_type: string;
		};
	};
}

export interface ICreateAddress {
	t4DAddress: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		pincode: string;
	};
}
