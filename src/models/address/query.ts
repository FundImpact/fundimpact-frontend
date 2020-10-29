export interface ICreateAddressVariables {
	input: {
		data: {
			t_4_d_contact: string;
			address_line_1: string;
			address_line_2?: string;
			pincode: string;
			city: string;
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
