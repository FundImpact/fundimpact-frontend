import { gql } from "@apollo/client";

export const CREATE_IMPACT_TRACKLINE = gql`
	mutation createImpactTrackingLineitemInput($input: ImpactTrackingLineitemInput!) {
		createImpactTrackingLineitemInput(input: $input) {
			id
			value
			note
			impact_target_project {
				id
				name
				target_value
				description
				project {
					id
					name
					short_name
					description
				}
				impact_category_unit {
					id
					impact_category_org {
						id
						name
						shortname
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
					impact_units_org {
						id
						name
						description
						code
						target_unit
						prefix_label
						suffix_label
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

export const UPDATE_IMPACT_TRACKLINE = gql`
	mutation updateImpactTrackingLineitemInput($id: ID!, $input: ImpactTrackingLineitemInput!) {
		updateImpactTrackingLineitemInput(id: $id, input: $input) {
			id
			value
			note
			impact_target_project {
				id
				name
				target_value
				description
				project {
					id
					name
					short_name
					description
				}
				impact_category_unit {
					id
					impact_category_org {
						id
						name
						shortname
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
					impact_units_org {
						id
						name
						description
						code
						target_unit
						prefix_label
						suffix_label
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

export const GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET = gql`
	query getImpactTrackingLimeItemByImpactTargetProject($filter: JSON) {
		impactTrackingLineitemList(where: $filter) {
			id
			value
			note
			reporting_date
			impact_target_project {
				id
				name
				target_value
				description
				project {
					id
					name
					short_name
					description
				}
				impact_category_unit {
					id
					impact_category_org {
						id
						name
						shortname
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
					impact_units_org {
						id
						name
						description
						code
						target_unit
						prefix_label
						suffix_label
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