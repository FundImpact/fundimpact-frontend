import { IMPACT_ACTIONS } from "../../components/Impact/constants";
import { DIALOG_TYPE } from "../constants";

export interface IImpactTarget {
	id?: number;
	name: string;
	description?: string;
	target_value: number | string;
	sustainable_development_goal?: string;
	impact_category_org: number | string;
	impact_units_org: number | string;
	project?: number | string;
}

export type ImpactTargetProps = {
	open: boolean;
	handleClose: () => void;
	project: number | string | undefined;
	dialogType?: DIALOG_TYPE;
} & (
	| {
			type: IMPACT_ACTIONS.CREATE;
	  }
	| {
			type: IMPACT_ACTIONS.UPDATE;
			data: IImpactTarget;
	  }
);
