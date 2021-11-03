import { gql } from "@apollo/client";

export const GET_TALLYMAPPER_COSTCENTER = gql`
	query getTallyMapperCostcenter($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		costCenters(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			created_at
			updated_at
			tally_id
			company_id
			cost_category_id
			cost_category
			name
			code
			group
			group_id
		}
	}
`;

export const GET_TALLYMAPPER_COSTCENTER_COUNT = gql`
	query getTallyMappercostCenteCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		costCentersConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
