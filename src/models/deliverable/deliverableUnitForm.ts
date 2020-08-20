import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { IDeliverableUnit } from "./deliverableUnit";

export interface IDeliverableUnitFormProps {
	initialValues: IDeliverableUnit;
	onCreate: (values: IDeliverableUnit) => void;
	onUpdate: (values: IDeliverableUnit) => void;
	clearErrors: any;
	validate: any;
	handleFormOpen: () => void;
	formIsOpen: boolean;
	formState: DELIVERABLE_ACTIONS.CREATE | DELIVERABLE_ACTIONS.UPDATE;
}
