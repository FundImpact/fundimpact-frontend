export interface IImpactCategory {
	name: string;
	shortname: string;
	code: string;
	description: string;
	id?: string;
}

export interface IImpactUnit {
	id?: string;
	name: string;
	description: string;
	code: string;
	target_unit: number;
	prefix_label: string;
	suffix_label: string;
}
