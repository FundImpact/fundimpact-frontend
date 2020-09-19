import { DELIVERABLE_ACTIONS } from "../../components/Deliverable/constants";

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
	  }
	| {
			type: DELIVERABLE_ACTIONS.UPDATE;
			data: IDeliverable;
			open: boolean;
			handleClose: () => void;
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
