import { FORM_ACTIONS } from "../constants";
import { IGrantPeriod } from "./grantPeriodForm";

export type GrantPeriodDialogProps = {
	open: boolean;
	onClose: () => void;
} & (
	| { action: FORM_ACTIONS.CREATE }
	| { action: FORM_ACTIONS.UPDATE; initialValues: IGrantPeriod }
);
