import { gql } from "@apollo/client";

export const GET_FUND_RECEIPT_PROJECT_LIST = gql`
	query getfundReceiptProjectListByProjectDonor(
		$sort: String
		$limit: Int
		$start: Int
		$filter: JSON
	) {
		fundReceiptProjectList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			amount
			reporting_date
			deleted
			grant_periods_project {
				id
				name
			}
			project_donor {
				id
				donor {
					id
					name
					deleted
				}
				project {
					id
					name
				}
			}
			project {
				id
			}
			donor {
				id
			}
		}
	}
`;

export const GET_FUND_RECEIPT_PROJECT_LIST_COUNT = gql`
	query getfundReceiptProjectListCount($filter: JSON) {
		fundReceiptProjectListCount(where: $filter)
	}
`;
