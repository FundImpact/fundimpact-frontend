export interface IGetUserRole {
	getRolePemissions: {
		id: string;
		controller: string;
		action: string;
		enabled: boolean;
	}[];
}
