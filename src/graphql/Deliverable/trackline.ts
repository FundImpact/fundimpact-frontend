import { gql } from "@apollo/client";

export const CREATE_DELIVERABLE_TRACKLINE = gql`
	mutation createDeliverableTrackingLineitemDetail($input: DeliverableTrackingLineitemInput!) {
		createDeliverableTrackingLineitemDetail(input: $input) {
			id
			value
			note
			reporting_date
			deliverable_sub_target {
				id
			}
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

					description
				}
			}
			annual_year {
				id
				name
				start_date
				end_date
			}
			financial_year_org {
				id
			}
			financial_year {
				id
				name

				start_date
				end_date
				country {
					id
					name
				}
			}
			timeperiod_start
			timeperiod_end
			grant_periods_project {
				id
				name
				description

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
			deliverable_sub_target {
				id
			}
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

					description
				}
			}
			annual_year {
				id
				name
				start_date
				end_date
			}
			financial_year_org {
				id
			}
			financial_year {
				id
				name

				start_date
				end_date
				country {
					id
					name
				}
			}
			timeperiod_start
			timeperiod_end
			grant_periods_project {
				id
				name
				description

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
	query deliverableTrackingLineitems($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		deliverableTrackingLineitems(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			deliverable_sub_target {
				id
				target_value
				deliverable_target_project {
					id
					name
					type
				}
			}
			timeperiod_start
			timeperiod_end
			value
			note
			reporting_date
			annual_year {
				name
				id
			}
			financial_year_org {
				id
				name
			}
			grant_periods_project {
				id
				name
			}
			financial_year_donor {
				id
				name
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
			deleted
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

					country {
						id
						name
					}
				}
			}
			financial_year {
				id
				name
			}
			grant_periods_project {
				id
				name
				description

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
	query deliverableTrackingLineitemsConnection(
		$sort: String
		$limit: Int
		$start: Int
		$filter: JSON
	) {
		deliverableTrackingLineitemsConnection(
			sort: $sort
			limit: $limit
			start: $start
			where: $filter
		) {
			aggregate {
				sum {
					value
				}
				count
			}
		}
	}
`;
