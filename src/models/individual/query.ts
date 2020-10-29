export interface ICreateIndividualVariables {
	input: {
		data: {
			name: string;
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
