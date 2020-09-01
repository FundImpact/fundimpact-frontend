import { FORM_ACTIONS } from "../constants";
import { IDONOR } from "../donor";

export interface IGrantPeriod {
	id?: string;
	name: string;
	short_name?: string;
	description?: string;
	start_date?: string;
	end_date?: string;
	donor: IDONOR["id"];
	// project: IProject["id"];
	project: string;
}
export type GrantPeriodFormProps = {
	onCancel: () => void;
	onSubmit: (values: IGrantPeriod) => void;
} & (
	| { action: FORM_ACTIONS.CREATE }
	| { action: FORM_ACTIONS.UPDATE; initialValues: IGrantPeriod }
);
