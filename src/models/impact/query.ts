import { IImpactCategoryData } from "./impact";

export interface IGetImpactCategory {
	impactCategoryOrgList: IImpactCategoryData[];
}

export interface IGetImpactCategoryVariables {
	filter: {
		organization: string;
	};
}
