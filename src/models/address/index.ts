export interface IAddressForm {
	address_line_1: string;
	address_line_2: string;
	pincode: string;
	city: string;
	address_type: string;
}

export interface IAddress {
	address_line_1: string;
	address_line_2: string;
	pincode: string;
	city: string;
	address_type: string;
	id: string;
	t_4_d_contact: {
		id: string;
	};
}
