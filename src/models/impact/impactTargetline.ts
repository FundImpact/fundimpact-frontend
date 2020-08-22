import { IMPACT_ACTIONS } from "../../components/Impact/constants";

export interface IImpactTargetLine {
	id?: number;
	impact_target_project: number | string | undefined;
	annual_year: string;
	value: string;
	financial_years_org?: number | string;
	financial_years_donor?: number | string;
	grant_period?: number | string;
	reporting_date: Date | string;
	note?: string;
}

export type ImpactTargetLineProps = {
	open: boolean;
	handleClose: () => void;
	impactTarget?: number | string | undefined;
} & (
	| {
			type: IMPACT_ACTIONS.CREATE;
	  }
	| {
			type: IMPACT_ACTIONS.UPDATE;
			data: IImpactTargetLine;
	  }
);
