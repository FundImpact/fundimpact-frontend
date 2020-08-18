import { IMPACT_ACTIONS } from "../../components/Impact/constants";

export interface IImpactTarget {
	id?: number;
	name: string;
	description?: string;
	target_value: number | string;
	impactCategory?: number | string;
	impactUnit?: number | string;
	impact_category_unit: number | string;
	project?: number | string;
}

export type ImpactTargetProps =
	| {
			type: IMPACT_ACTIONS.CREATE;
			open: boolean;
			handleClose: () => void;
			project: number | string | undefined;
	  }
	| {
			type: IMPACT_ACTIONS.UPDATE;
			data: IImpactTarget;
			open: boolean;
			handleClose: () => void;
			project: number | string | undefined;
	  };
