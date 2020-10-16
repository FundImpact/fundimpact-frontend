export interface IDONOR_RESPONSE {
	id: string;
	name: string;
	country: {
		name: string;
		id: string;
	};
	legal_name: string;
	short_name: string;
}

export interface IGET_DONOR {
	orgDonors: IDONOR_RESPONSE[];
}
