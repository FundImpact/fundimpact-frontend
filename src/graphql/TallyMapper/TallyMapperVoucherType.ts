import { gql } from "@apollo/client";

export const GET_TALLYMAPPER_VOUCHERTYPE = gql`
	query getTallyMapperVoucherTypes($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		voucherTypes(sort: $sort, limit: $limit, start: $start, where: $filter) {
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

export const GET_TALLYMAPPER_VOUCHERTYPE_COUNT = gql`
	query getTallyMappercostCenteCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		voucherTypesConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
