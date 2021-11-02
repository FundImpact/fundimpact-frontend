import { gql } from "@apollo/client";

export const GET_TALLYMAPPER_COSTCATEGORIES = gql`
	query getTallyMapperCostcategories($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		costCategories(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			created_at
			updated_at
			u_id
			tally_id
			company_id
			name
			code
			group
			group_id
		}
	}
`;

export const GET_TALLYMAPPER_COSTCATEGORIES_COUNT = gql`
	query getTallyMappercostCenteCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		costCategoriesConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
