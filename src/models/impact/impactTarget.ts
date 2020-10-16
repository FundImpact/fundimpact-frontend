import { IMPACT_ACTIONS } from "../../components/Impact/constants";

export interface IImpactTarget {
	id?: number;
	name: string;
	description?: string;
	target_value: number | string;
	impactCategory?: number | string;
	impactUnit?: number | string;
	sustainable_development_goal?: string;
	impact_category_unit: number | string;
	project?: number | string;
}

export type ImpactTargetProps = {
	open: boolean;
	handleClose: () => void;
	project: number | string | undefined;
} & (
	| {
			type: IMPACT_ACTIONS.CREATE;
	  }
	| {
			type: IMPACT_ACTIONS.UPDATE;
			data: IImpactTarget;
	  }
);
