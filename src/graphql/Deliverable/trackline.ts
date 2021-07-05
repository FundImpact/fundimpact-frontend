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
				deliverable_category_org {
					id
					name
					code
					description
					organization {
						id
						name
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
				deliverable_unit_org {
					id
					name
					description
					code
					unit_type
					prefix_label
					suffix_label
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
			financial_year {
				id
				name
				short_name
				start_date
				end_date
				country {
					id
					name
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
			deleted
			deliverable_target_project {
				id
				name
				description
				target_value
				deleted
				deliverable_category_org {
					id
					name
					code
					description
					deleted
					organization {
						id
						name
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
				deliverable_unit_org {
					id
					name
					description
					code
					unit_type
					prefix_label
					suffix_label
					deleted
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
			financial_year {
				id
				name
				short_name
				start_date
				end_date
				country {
					id
					name
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
			deleted
			deliverable_target_project {
				id
				name
				description
				target_value
				deliverable_unit_org {
					id
					name
				}
				deleted
			}
			annual_year {
				id
				name
				short_name
				start_date
				end_date
			}
			financial_year {
				id
				name
				short_name
				start_date
				end_date
				country {
					id
					name
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
			attachments {
				id
				name
				size
				caption
				url
				ext
				created_at
			}
		}
	}
`;

export const CREATE_DELIVERABLE_LINEITEM_FYDONOR = gql`
	mutation createDeliverableLinitemFyDonorInput($input: DeliverableLinitemFyDonorInput!) {
		createDeliverableLinitemFyDonorInput(input: $input) {
			id
			deliverable_tracking_lineitem {
				id
				note
				value
				reporting_date
				deliverable_target_project {
					id
				}
				annual_year {
					id
				}
				grant_periods_project {
					id
				}
			}
			project_donor {
				id
				project {
					id
				}
				donor {
					id
					name
					country {
						id
						name
					}
					deleted
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
			financial_year {
				id
				name
				short_name
				start_date
				end_date
				country {
					id
				}
			}
		}
	}
`;

export const UPDATE_DELIVERABLE_LINEITEM_FYDONOR = gql`
	mutation updateDeliverableLinitemFyDonorInput(
		$id: ID!
		$input: DeliverableLinitemFyDonorInput!
	) {
		updateDeliverableLinitemFyDonorInput(id: $id, input: $input) {
			id
			deliverable_tracking_lineitem {
				id
				note
				value
				reporting_date
				deliverable_target_project {
					id
				}
				annual_year {
					id
				}
				grant_periods_project {
					id
				}
			}
			project_donor {
				id
				project {
					id
				}
				donor {
					id
					name
					country {
						id
						name
					}
					deleted
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
			financial_year {
				id
				name
				short_name
				start_date
				end_date
				country {
					id
				}
			}
		}
	}
`;

export const GET_DELIVERABLE_TRANCHE = gql`
	query deliverableLinitemFyDonorList($filter: JSON) {
		deliverableLinitemFyDonorList(where: $filter) {
			id
			project_donor {
				id
				project {
					id
				}
				donor {
					id
					name
					short_name
					country {
						id
						name
					}
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

export const GET_DELIVERABLE_LINEITEM_FYDONOR = gql`
	query deliverableLinitemFyDonorList($filter: JSON) {
		deliverableLinitemFyDonorList(where: $filter) {
			id
			deliverable_tracking_lineitem {
				id
				note
				value
				reporting_date
				deleted
				deliverable_target_project {
					id
					deleted
				}
				annual_year {
					id
				}
				grant_periods_project {
					id
				}
			}
			project_donor {
				id
				project {
					id
				}
				donor {
					id
					name
					country {
						id
						name
					}
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
			financial_year {
				id
				name
				short_name
				start_date
				end_date
				country {
					id
				}
			}
		}
	}
`;

export const GET_DELIVERABLE_TRACKLINE_COUNT = gql`
	query getDeliverableTrackingLineitemListCountByTarget($filter: JSON) {
		deliverableTrackingLineitemCount(where: $filter)
	}
`;
