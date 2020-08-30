import { FORM_ACTIONS } from "../constants";

export interface IDONOR {
	id?: string;
	organization?: string;
	name: string;
	legal_name: string;
	short_name: string;
	country: string;
}

export type IDonorProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IDONOR;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
	  };
