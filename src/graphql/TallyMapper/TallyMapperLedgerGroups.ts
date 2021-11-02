import { gql } from "@apollo/client";

export const GET_TALLYMAPPER_LEDGERGROUP = gql`
	query getTallyMapperLedgerGroup($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		ledgerGroups(sort: $sort, limit: $limit, start: $start, where: $filter) {
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

export const GET_TALLYMAPPER_LEDGERGROUP_COUNT = gql`
	query getTallyMapperLedgerGroupCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		ledgerGroupsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
