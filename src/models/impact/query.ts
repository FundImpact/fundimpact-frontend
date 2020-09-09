import { IProject } from "../project/project";
import { IOrganisation } from "../organisation/types";
import { IImpactCategoryData } from "./impact";
import {  IImpactUnitData } from "./impact";

export interface IImpactCategoryUnitResponse {
	id: string;
	impact_category_org: {
		id: string;
		name: string;
		code: string;
		description: string;
		organization: IOrganisation;
	};
	impact_units_org: {
		id: string;
		name: string;
		code: string;
		description: string;
		unit_type: string;
		prefix_label: string;
		suffix_label: string;
	};
}
export interface IImpactTargetByProjectResponse {
	id: string;
	name: string;
	target_value: number;
	description: string;
	impact_category_unit: IImpactCategoryUnitResponse;
	project: Partial<IProject>;
}

export interface IImpactTracklineByTargetResponse {
	id: string;
	value: string;
	note: string;
	reporting_date: string;
	impact_target_project: Partial<IImpactTargetByProjectResponse>;
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

export interface IGET_IMPACT_TARGET_BY_PROJECT {
	impactTargetProjectList: IImpactTargetByProjectResponse[];
}

export interface IGET_IMPACT_TRACKLINE_BY_TARGET {
	impactTrackingLineitemList: IImpactTracklineByTargetResponse[];
}


export interface IGetImpactCategory {
	impactCategoryOrgList: IImpactCategoryData[];
}

export interface IGetImpactCategoryVariables {
	filter: {
		organization: string;
	};
}
export interface IGetImpactUnit {
	impactUnitsOrgList: IImpactUnitData[];
}

export interface IGetImpactUnitVariables {
	filter: {
		organization: string;
	};
}

export interface IGetImpactCategoryUnitVariables {
	filter: {
		impact_category_org?: string;
		impact_units_org?: string;
	};
}

export interface IGetImpactCategoryUnit {
	impactCategoryUnitList: {
		id: string;
		impact_category_org: IImpactCategoryData;
		impact_units_org: IImpactUnitData;
	}[];
}
