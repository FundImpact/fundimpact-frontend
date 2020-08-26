import { gql } from "@apollo/client";

export const CREATE_IMPACT_TARGET = gql`
	mutation createImpactTargetProjectInput($input: ImpactTargetProjectInput!) {
		createImpactTargetProjectInput(input: $input) {
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
	}
`;

export const UPDATE_IMAPACT_TARGET = gql`
	mutation updateImpactTargetProjectInput($id: ID!, $input: ImpactTargetProjectInput!) {
		updateImpactTargetProjectInput(id: $id, input: $input) {
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
	}
`;

export const GET_IMPACT_TARGET_BY_PROJECT = gql`
	query getImpactTargetProjectByImpactCategoryUnit($filter: JSON) {
		impactTargetProjectList(where: $filter) {
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
	}
`;
