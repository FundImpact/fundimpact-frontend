import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { IDeliverable } from "./deliverable";

export interface IDeliverableFormProps {
	initialValues: IDeliverable;
	onCreate: (values: IDeliverable) => void;
	onUpdate: (values: IDeliverable) => void;
	clearErrors: any;
	validate: any;
	handleFormOpen: () => void;
	formIsOpen: boolean;
	formState: DELIVERABLE_ACTIONS.CREATE | DELIVERABLE_ACTIONS.UPDATE;
}
