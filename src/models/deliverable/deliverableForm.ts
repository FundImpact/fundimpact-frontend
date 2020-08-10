import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { IDeliverable } from "./deliverable";

export interface IDeliverableFormProps {
	initialValues: IDeliverable;
	onCreate: (values: IDeliverable) => void;
	onUpdate: (values: IDeliverable) => void;
	clearErrors: any;
	validate: any;
	formState: DELIVERABLE_ACTIONS.CREATE | DELIVERABLE_ACTIONS.UPDATE;
	project: number;
}
