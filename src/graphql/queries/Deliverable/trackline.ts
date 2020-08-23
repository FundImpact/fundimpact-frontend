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

export const UPDATE_DELIVERABLE_TRACKLINE = gql`
	mutation updateDeliverableTrackingLineitemDetail(
		$id: ID!
		$input: DeliverableTrackingLineitemInput!
	) {
		updateDeliverableTrackingLineitemDetail(id: $id, input: $input) {
			id
			value
			note
			reporting_date
			deliverable_target_project {
				id
				name
				description
				target_value
				deliverable_category_unit {
					deliverable_category_org {
						id
						name
						code
						description
						organization {
							id
							name
							address
							account {
								id
								name
								description
								account_no
							}
							short_name
							legal_name
							description
							organization_registration_type {
								id
								reg_type
							}
						}
					}
					deliverable_units_org {
						id
						name
						description
						code
						unit_type
						prefix_label
						suffix_label
					}
				}
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

export const GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET = gql`
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
