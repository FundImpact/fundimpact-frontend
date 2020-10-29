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

export interface IUpdateAddressVariables {
	input: {
		where: {
			id: string;
		};
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
	createT4DAddress: {
		t4DAddress: {
			id: string;
			address_line_1: string;
			address_line_2: string;
			pincode: string;
			city: string;
			address_type: string;
		};
	};
}

export interface IUpdateAddress {
	updateT4DAddress: {
		t4DAddress: {
			id: string;
			address_line_1: string;
			address_line_2: string;
			pincode: string;
			city: string;
			address_type: string;
		};
	};
}

export interface IGetAddress {
	t4DAddresses: {
		id: string;
		address_line_1: string;
		address_line_2: string;
		pincode: string;
		city: string;
		address_type: string;
		t_4_d_contact: {
			id: string;
		};
	}[];
}

export interface IGetAddressVariables {
	where: {
		t_4_d_contact: string;
	};
}
