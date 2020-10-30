export interface ICreateIndividualVariables {
	input: {
		data: {
			name: string;
			organization: string;
		};
	};
}

export interface IUpdateIndividualVariables {
	input: {
		data: {
			name: string;
		};
		where: {
			id: string;
		};
	};
}

export interface ICreateIndividual {
	createT4DIndividual: {
		t4DIndividual: {
			id: string;
			name: string;
		};
	};
}

export interface IUpdateIndividual {
	updateT4DIndividual: {
		t4DIndividual: {
			id: string;
			name: string;
		};
	};
}

export interface ICreateIndividualProjectVariables {
	input: {
		data: {
			project: string;
			t4d_individual: string;
		};
	};
}

export interface IDeleteIndividualProjectVariables {
	input: {
		where: {
			id: string;
		};
	};
}

export interface ICreateIndividualProject {
	createT4DProjectIndividual: {
		t4DProjectIndividual: {
			id: string;
		};
	};
}

export interface IDeleteIndividualProject {
	deleteT4DProjectIndividual: {
		t4DProjectIndividual: {
			id: string;
		};
	};
}

export interface IGET_INDIVIDUAL_LIST {
	t4DIndividuals: {
		id: string;
		name: string;
		t4d_project_individuals: {
			project: { id: string; name: string; workspace: { id: string; name: string } };
		}[];
	}[];
}
