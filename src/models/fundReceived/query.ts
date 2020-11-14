import { IFundReceivedForm, IFundReceived } from ".";

export interface IGet_Fund_Receipt_List {
	fundReceiptProjectList: {
		id: string;
		amount: number;
		reporting_date: Date;
		project_donor: {
			id: string;
			donor: { id: string; name: string };
		};
	}[];
}

export interface IGet_Fund_Receipt_List_Variables {
	filter: {
		project: string | number;
	};
}

export interface ICreateFundReceipt {
	createFundReceiptProjectInput: IGet_Fund_Receipt_List["fundReceiptProjectList"][0];
}

export interface IUpdateFundReceipt {
	updateFundReceiptProjectInput: IGet_Fund_Receipt_List["fundReceiptProjectList"][0];
}

export interface ICreateFundReceiptVariables {
	input: IFundReceivedForm;
}

export interface IUpdateFundReceiptVariables {
	id: string,
	input: IFundReceived;
}