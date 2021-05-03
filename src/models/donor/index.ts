import { DIALOG_TYPE, FORM_ACTIONS } from "../constants";
import { DONOR_DIALOG_TYPE } from "./constants";

export interface IDONOR {
	id?: string;
	organization?: string;
	name: string;
	legal_name: string;
	short_name: string;
	country: string;
	// currency: string
}

export type IDonorProps =
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.UPDATE;
			initialValues: IDONOR;
			deleteDonor?: boolean;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			dialogType: DONOR_DIALOG_TYPE.PROJECT;
			projectId: string;
			deleteDonor?: boolean;
	  }
	| {
			open: boolean;
			handleClose: () => void;
			formAction: FORM_ACTIONS.CREATE;
			dialogType?: DONOR_DIALOG_TYPE.DONOR;
			deleteDonor?: boolean;
	  };
