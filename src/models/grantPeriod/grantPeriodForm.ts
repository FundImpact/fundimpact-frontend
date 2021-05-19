import { FORM_ACTIONS } from "../constants";
import { IDONOR } from "../donor";
import { FetchResult } from "@apollo/client";

export enum DonorType {
	project = "PROJECT'S DONOR",
	organization = "ALL DONORS",
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
	setSelectedDonor: React.Dispatch<React.SetStateAction<string>>;
	setCreateProjectDonorCheckboxVal: React.Dispatch<React.SetStateAction<boolean>>;
	showCreateProjectDonorCheckbox: boolean;
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
