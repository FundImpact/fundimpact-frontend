import { ApolloQueryResult } from "@apollo/client";
import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { AttachFile } from "../AttachFile";
import { DELIVERABLE_TYPE, DIALOG_TYPE } from "../constants";

export interface IDeliverableTargetLine {
	id?: number;
	deliverable_target_project?: number | string | undefined;
	deliverable_sub_target?:
		| {
				id?: string;
				name?: string;
				deliverable_target_project: {
					id?: string;
					name?: string;
					type: "deliverable" | "impact";
				};
		  }
		| any;
	annual_year: string;
	value: number | string;
	value_qualitative?: string;
	financial_year: string;
	financial_year_org: string;
	financial_year_donor: string;
	timeperiod_start: Date | string;
	timeperiod_end: Date | string;
	reporting_date: Date | string;
	donors?:
		| {
				id: string;
				name: string;
				donor: { id: string; name: string; country: { id: string; name: string } };
		  }[]
		| [];
	donorMapValues?: object;
	note?: string;
	attachments?: AttachFile[];
}

export type DeliverableTargetLineProps = {
	open: boolean;
	handleClose: () => void;
	deliverableSubTargetId?: number | undefined;
	formType: DELIVERABLE_TYPE;
	deliverableTarget?: number | string | undefined;
	reftechOnSuccess?: (
		variables?: Partial<Record<string, any>> | undefined
	) => Promise<ApolloQueryResult<any>>;
	dialogType?: DIALOG_TYPE;
	qualitativeParent?: boolean;
	targetValueOptions?: { id: string; name: string }[];
} & (
	| {
			type?: DELIVERABLE_ACTIONS.CREATE;
	  }
	| {
			type?: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverableTargetLine;
			alreadyMappedDonorsIds: string[];
	  }
);
