import { FORM_ACTIONS } from "../constants";
import { IDONOR } from "../donor";
import { FetchResult } from "@apollo/client";

export enum DonorType {
	project = "PROJECT'S DONOR",
	organization = "ALL DONOR",
}

export interface IGrantPeriod {
	id?: string;
	name: string;
	short_name?: string;
	description?: string;
	start_date?: string;
	end_date?: string;
	donor: IDONOR["id"];
	// project: IProject["id"];
	project: string;
}
export type GrantPeriodFormProps = {
	onCancel: () => void;
	onSubmit: (
		value: IGrantPeriod
	) => Promise<FetchResult<any, Record<string, any>, Record<string, any>> | undefined>;
	allDonors: (
		| {
				id: string;
				name: string;
		  }
		| {
				groupName: React.ReactNode;
		  }
	)[];
} & (
	| { action: FORM_ACTIONS.CREATE }
	| { action: FORM_ACTIONS.UPDATE; initialValues: IGrantPeriod }
);
