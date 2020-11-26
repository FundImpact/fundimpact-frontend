import { IProject } from "../project/project";
import { IOrganisation } from "../organisation/types";
import { IDeliverableCategoryData } from "./deliverable";
import { IDeliverableUnitData } from "../deliverable/deliverableUnit";

export interface IDeliverableCategoryUnitResponse {
	id: string;
	deliverable_category_org: {
		id: string;
		name: string;
		code: string;
		description: string;
		organization: IOrganisation;
	};
	deliverable_units_org: {
		id: string;
		name: string;
		code: string;
		description: string;
		unit_type: string;
		prefix_label: string;
		suffix_label: string;
	};
}
export interface IDeliverableTargetByProjectResponse {
	id: string;
	name: string;
	target_value: number;
	description: string;
	deliverable_category_unit: IDeliverableCategoryUnitResponse;
	project: Partial<IProject>;
}

export interface IDeliverableTracklineByTargetResponse {
	id: string;
	value: string;
	note: string;
	reporting_date: string;
	deliverable_target_project: Partial<IDeliverableTargetByProjectResponse>;
	annual_year: {
		id: string;
		name: string;
		short_name: string;
		start_date: string;
		end_date: string;
	};
	financial_year: {
		id: string;
		name: string;
		country: { id: string; name: string };
	};
}

export interface IGET_DELIVERABLE_TARGET_BY_PROJECT {
	deliverableTargetList: IDeliverableTargetByProjectResponse[];
}

export interface IGET_DELIVERABLE_TRACKLINE_BY_TARGET {
	deliverableTrackingLineitemList: IDeliverableTracklineByTargetResponse[];
}

export interface IGetDeliverableCategory {
	deliverableCategory: IDeliverableCategoryData[];
}

export interface IGetDeliverablCategoryVariables {
	filter: {
		organization: string;
	};
}
export interface IGetDeliverablUnit {
	deliverableUnitOrg: IDeliverableUnitData[];
}

export interface IGetDeliverableUnitVariables {
	filter: {
		organization: string;
	};
}

export interface IGetDeliverableCategoryUnitVariables {
	filter: {
		deliverable_category_org?: string;
		deliverable_units_org?: string;
	};
}

export interface IUpdateDeliverableCategoryUnitVariables {
	id: string;
	input: {
		status: boolean;
	};
}

export interface IGetDeliverableCategoryUnit {
	deliverableCategoryUnitList: {
		id: string;
		status: boolean;
		deliverable_category_org: IDeliverableCategoryData;
		deliverable_units_org: IDeliverableUnitData;
	}[];
}

export interface IUpdateDeliverableCategoryUnit {
	updateDeliverableCategoryUnitInput: {
		id: string;
		status: boolean;
		deliverable_category_org: IDeliverableCategoryData;
		deliverable_units_org: IDeliverableUnitData;
	}[];
}
