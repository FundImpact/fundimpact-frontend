import { IImpactCategoryData, IImpactUnitData } from "./impact";

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
