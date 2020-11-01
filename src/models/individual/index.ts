export interface IIndividualForm {
	name: string;
	project: { id: string; name: string; workspace: { id: string; name: string } }[];
}

export interface IIndividual {
	id: string;
	name: string;
	t4d_project_individuals: {
		id: string;
		project: { id: string; name: string; workspace: { id: string; name: string } };
	}[];
}
