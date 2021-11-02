import { gql } from "@apollo/client";

export const GET_TALLYMAPPER_LEDGERS = gql`
	query getTallyMapperLedgers($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		ledgers(sort: $sort, limit: $limit, start: $start, where: $filter) {
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

export const GET_TALLYMAPPER_LEDGERS_COUNT = gql`
	query getTallyMapperLedgersCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		ledgersConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
