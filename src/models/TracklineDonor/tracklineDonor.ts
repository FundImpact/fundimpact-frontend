import { FORM_ACTIONS } from "../../components/Forms/constant";
import { DocumentNode } from "graphql";

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
} & (
	| {
			type: FORM_ACTIONS.CREATE;
	  }
	| {
			type: FORM_ACTIONS.UPDATE;
			data: any;
	  }
);
