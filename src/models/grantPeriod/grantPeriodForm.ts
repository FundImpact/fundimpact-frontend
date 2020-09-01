import { FORM_ACTIONS } from "../constants";

export interface IGrantPeriod {
	id?: string;
	name: string;
	short_name?: string;
	description?: string;
	start_date?: string;
	end_Date?: string;
	project: string;
}
export type GrantPeriodFormProps = {
	onCancel: () => void;
	onSubmit: (values: IGrantPeriod) => void;
} & (
	| { action: FORM_ACTIONS.CREATE }
	| { action: FORM_ACTIONS.UPDATE; initialValues: IGrantPeriod & { id: string } }
);
