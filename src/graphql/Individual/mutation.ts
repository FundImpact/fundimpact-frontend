import { gql } from "@apollo/client";

export const CREATE_INDIVIDUAL = gql`
	mutation createT4DIndividual($input: createT4DIndividualInput) {
		createT4DIndividual(input: $input) {
			t4DIndividual {
				id
				name
			}
		}
	}
`;

export const UPDATE_INDIVIDUAL = gql`
	mutation($input: updateT4DIndividualInput) {
		updateT4DIndividual(input: $input) {
			t4DIndividual {
				id
				name
				deleted
				t4d_project_individuals {
					project {
						id
						name
						workspace {
							id
							name
						}
					}
				}
			}
		}
	}
`;

export const CREATE_INDIVIDUAL_PROJECT = gql`
	mutation createT4DProjectIndividual($input: createT4DProjectIndividualInput) {
		createT4DProjectIndividual(input: $input) {
			t4DProjectIndividual {
				id
				t4d_individual {
					id
					name
				}
				project {
					id
					name
				}
			}
		}
	}
`;

export const DELETE_INDIVIDUAL_PROJECT = gql`
	mutation deleteT4DProjectIndividual($input: deleteT4DProjectIndividualInput) {
		deleteT4DProjectIndividual(input: $input) {
			t4DProjectIndividual {
				id
				t4d_individual {
					id
					name
				}
				project {
					id
					name
					workspace {
						id
						name
					}
				}
			}
		}
	}
`;
