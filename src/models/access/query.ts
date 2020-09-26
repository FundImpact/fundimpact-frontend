export interface IGetUserRole {
	role: {
		permissions: {
			id: string;
			controller: string;
			action: string;
			enabled: boolean;
		}[];
	};
}
