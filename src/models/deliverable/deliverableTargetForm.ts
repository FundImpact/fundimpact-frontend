import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { IDeliverableTarget } from "./deliverableTarget";

export interface IDeliverableTargetFormProps {
	initialValues: IDeliverableTarget;
	onCreate: (values: IDeliverableTarget) => void;
	onUpdate: (values: IDeliverableTarget) => void;
	clearErrors: any;
	validate: any;
	handleFormOpen: () => void;
	formIsOpen: boolean;
	formState: DELIVERABLE_ACTIONS.CREATE | DELIVERABLE_ACTIONS.UPDATE;
}
