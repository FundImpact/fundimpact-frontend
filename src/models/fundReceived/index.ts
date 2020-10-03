export interface IFundReceived {
	amount: number;
	id?: string;
	project_donor: string;
	reporting_date: string;
}

export interface IFundReceivedForm extends Omit<IFundReceived, "id" | "amount"> {
	amount: string;
}
