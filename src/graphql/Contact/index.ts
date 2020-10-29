import { gql } from "@apollo/client";

export const GET_CONTACT_LIST = gql`
	query getT4DContacts($sort: String, $limit: Int, $start: Int, $where: JSON) {
		t4DContacts(sort: $sort, limit: $limit, start: $start, where: $where) {
			id
			email
			email_other
			phone
			phone_other
      contact_type
		}
	}
`;
