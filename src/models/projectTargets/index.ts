import { FORM_ACTIONS } from "../../components/Forms/constant";
import { DELIVERABLE_TYPE } from "../constants";

export interface IProjectTargets {
	target: string;
	projects: string[];
}

export type ProjectTargetsProps = {
	open: boolean;
	handleClose: () => void;
	type: FORM_ACTIONS.UPDATE;
	projects?: string[];
	formType: DELIVERABLE_TYPE | "budget";
};
