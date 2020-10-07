import { FORM_ACTIONS } from "../constants";

export interface IFundReceived {
	amount: number;
	id?: string;
	project_donor: string;
	reporting_date: string;
}

export interface IFundReceivedForm extends Omit<IFundReceived, "amount"> {
	amount: string;
}

export type IFundReceivedProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IFundReceivedForm;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			initialValues?: IFundReceivedForm;
	  };
