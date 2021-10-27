import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";
import { DIALOG_TYPE } from "../constants";

export interface IDeliverable {
	id?: number;
	name: string;
	code?: string;
	description?: string;
	organization?: number | string;
}

export interface IDeliverableCategoryData extends Omit<IDeliverable, "id" | "organization"> {
	id: string;
}

export type DeliverableProps =
	| {
			type: DELIVERABLE_ACTIONS.CREATE;
			open: boolean;
			handleClose: () => void;
			organization: number | string | undefined;
			dialogType?: DIALOG_TYPE;
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverable;
			open: boolean;
			handleClose: () => void;
			dialogType?: DIALOG_TYPE;
	  };

// workspaces: NonNullable < Pick < IWorkspace, "id" | ("name" >> []);

export interface IDeliverableCategoryUnitTableFilter {
	name: string;
	code: string;
	description: string;
}

export interface IImpactCategoryUnitTableFilter {
	name: string;
	code: string;
	description: string;
}

export interface IDeliverableCategory {
	id?: string;
	name: string;
	code: string | null;
	description: string | null;
	project_id?: ProjectId;
	deliverable_type_id?: DeliverableType | null;
}

export type DeliverableType = {
	id?: string;
	name: string;
};

export type ProjectId = {
	id: string;
	name: string;
};
