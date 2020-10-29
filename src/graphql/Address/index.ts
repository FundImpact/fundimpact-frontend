import { gql } from "@apollo/client";

export const GET_ADDRESS_LIST = gql`
	query getT4DAddresses($sort: String, $limit: Int, $start: Int, $where: JSON) {
		t4DAddresses(sort: $sort, limit: $limit, start: $start, where: $where) {
			id
			address_line_1
			address_line_2
			pincode
			city
			address_type
		}
	}
`;
