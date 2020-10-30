import { gql } from "@apollo/client";

export const GET_ADDRESS_LIST = gql`
	query getT4DAddresses($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		t4DAddresses(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			address_line_1
			address_line_2
			pincode
			city
			address_type
			t_4_d_contact {
				id
			}
		}
	}
`;

export const GET_ADDRESS_LIST_COUNT = gql`
	query t4DAddressesConnection($filter: JSON) {
		t4DAddressesConnection(where: $filter) {
			aggregate {
				count
			}
		}
	}
`;
