import { gql } from "@apollo/client";

export const CREATE_DELIVERABLE_TRACKLINE = gql`
	mutation createDeliverableTrackingLineitemDetail($input: DeliverableTrackingLineitemInput!) {
		createDeliverableTrackingLineitemDetail(input: $input) {
			id
			value
			note
			reporting_date
			deliverable_target_project {
				id
				name
				description
				target_value

				project {
					id
					name
					short_name
					description
				}
			}
			annual_year {
				id
				name
				short_name
				start_date
				end_date
			}
			financial_years_org {
				id
				name
				short_name
				start_date
				end_date
			}
			financial_years_donor {
				id
				name
				short_name
				start_date
				end_date
				donor {
					id
					name
					short_name
					legal_name
				}
			}
			grant_periods_project {
				id
				name
				description
				short_name
				start_date
				end_date
				project {
					id
					name
				}
			}
		}
	}
`;

export const GET_DELIVERABle_TRACKLINE_BY_DELIVERABLE_TARGET = gql`
	query getDeliverableTrackingLineitemListByTarget(
		$sort: String
		$limit: Int
		$start: Int
		$filter: JSON
	) {
		deliverableTrackingLineitemList(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			value
			note
			reporting_date
			deliverable_target_project {
				id
				name
				description
				target_value
			}
			annual_year {
				id
				name
				short_name
				start_date
				end_date
			}
			financial_years_org {
				id
				name
				short_name
				start_date
				end_date
			}
			financial_years_donor {
				id
				name
				short_name
				start_date
				end_date
				donor {
					id
					name
					short_name
					legal_name
				}
			}
			grant_periods_project {
				id
				name
				description
				short_name
				start_date
				end_date
				project {
					id
					name
				}
			}
		}
	}
`;
