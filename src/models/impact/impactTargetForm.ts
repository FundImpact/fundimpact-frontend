import { IMPACT_ACTIONS } from "../../components/Impact/constants";
import { IImpactTarget } from "./impactTarget";

export interface IImpactTargetFormProps {
	initialValues: IImpactTarget;
	onCreate: (values: IImpactTarget) => void;
	onUpdate: (values: IImpactTarget) => void;
	clearErrors: any;
	validate: any;
	handleFormOpen: () => void;
	formIsOpen: boolean;
	formState: IMPACT_ACTIONS.CREATE | IMPACT_ACTIONS.UPDATE;
}
