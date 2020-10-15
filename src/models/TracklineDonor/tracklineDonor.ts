import { FORM_ACTIONS } from "../../components/Forms/constant";

export enum FORMOF {
	IMPACT = "IMPACT",
	DELIVERABLE = "DELIVERABLE",
}
export type TracklineDonorFormProps = {
	donors:
		| {
				id: string;
				name: string;
				donor: { id: string; name: string; country: { id: string; name: string } };
		  }[]
		| undefined;

	TracklineId: string;
	onCancel: () => void;
	TracklineFyId: string;
	organizationCountry?: string;
	formType?: FORMOF;
} & (
	| { type: FORM_ACTIONS.CREATE }
	| {
			type: FORM_ACTIONS.UPDATE;
			data?: any;
			alreadyMappedDonorsIds: string[];
	  }
);
