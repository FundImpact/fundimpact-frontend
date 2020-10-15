import { IMPACT_ACTIONS } from "../../components/Impact/constants";

export interface IImpactTargetLine {
	id?: number;
	impact_target_project: number | string | undefined;
	annual_year: string;
	value: number | string;
	financial_year: string;
	reporting_date: Date | string;
	impactDonorMapValues?: object;
	donors?:
		| {
				id: string;
				name: string;
				donor: { id: string; name: string; country: { id: string; name: string } };
		  }[]
		| [];
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
			alreadyMappedDonorsIds: string[];
	  }
);
