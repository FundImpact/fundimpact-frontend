import { gql } from "@apollo/client";

export const GET_INDIVIDUALS = gql`
	query getT4DIndividuals($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		t4DIndividuals(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			t4d_project_individuals {
				id
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
