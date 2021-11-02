import { IProject } from "../project/project";
import { IOrganisation } from "../organisation/types";
import { IDeliverableUnitData } from "../deliverable/deliverableUnit";
import { IGeographiesCountryData } from "./geographies";
import { IGeographiesStateData } from "./geographiesState";

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

export interface IGeographiesCountryDataRespone {
	countryData: {
		id: string;
		name: string;
		code: string;
	};
}

export interface IGetGeographiesCountry {
	geographiesCountry: IGeographiesCountryData[];
}

export interface IGetGeographiesCountryVariables {
	filter: {
		code: any;
	};
}
export interface IGetGeographieState {
	geographiesStateOrg: IGeographiesStateData[];
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
		deliverable_category_org: IGeographiesCountryData;
		deliverable_units_org: IDeliverableUnitData;
	}[];
}

export interface IUpdateDeliverableCategoryUnit {
	updateDeliverableCategoryUnitInput: {
		id: string;
		status: boolean;
		deliverable_category_org: IGeographiesCountryData;
		deliverable_units_org: IDeliverableUnitData;
	}[];
}
