import { gql } from "@apollo/client";

export const GET_ORGANISATIONS = gql`
	query organization($id: ID!) {
		organization(id: $id) {
			id
			name
			short_name
			legal_name
			organization_registration_type {
				id
				reg_type
			}
			account {
				id
				name
			}
			logo {
				id
				url
			}
			theme
			currency {
				id
			}
		}
	}
`;

// TODO: The fields for workspaces must match with the Create Workspace Mutation
export const GET_WORKSPACES_BY_ORG = gql`
	query getWorkspacesByOrganisation($filter: JSON) {
		orgWorkspaces(where: $filter) {
			id
			name
			short_name
			description
			organization {
				id
				name
			}
		}
	}
`;
export const GET_WORKSPACES = gql`
	query getWorkspaceAndProject {
		orgWorkspaces {
			id
			name
			organization {
				name
			}
		}
	}
`;

export const GET_PROJECTS_BY_WORKSPACE = gql`
	query getProjectsByWorkspace($filter: JSON) {
		orgProject(where: $filter) {
			id
			name
			short_name
			description
			workspace {
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
		}
	}
`;

export const GET_PROJECTS = gql`
	query {
		orgProject {
			id
			name
			workspace {
				id
				name
			}
		}
	}
`;

export const GET_ORG_CURRENCIES_BY_ORG = gql`
	query getorgCurrenciesByorg($filter: JSON) {
		orgCurrencies(where: $filter) {
			id
			isHomeCurrency
			currency {
				id
				name
				code
			}
		}
	}
`;

export const GET_FINANCIAL_YEARS_ORG_LIST_BY_ORG = gql`
	query getfinancialYearsOrgListByOrg($filter: JSON) {
		financialYearsOrgList(where: $filter) {
			id
			name
		}
	}
`;
export const GET_FINANCIAL_YEARS_DONOR_LIST_BY_DONOR = gql`
	query getfinancialYearsDonorListByDonor($filter: JSON) {
		financialYearsDonorList(where: $filter) {
			id
			name
		}
	}
`;

export const GET_ANNUAL_YEAR_LIST = gql`
	query {
		annualYearList {
			id
			name
			short_name
			start_date
			end_date
		}
	}
`;
export const GET_ANNUAL_YEARS = gql`
	query {
		annualYears {
			id
			name
			short_name
		}
	}
`;

export const GET_FINANCIAL_YEARS = gql`
	query getFinancialYearListBycountry($filter: JSON) {
		financialYearList(where: $filter) {
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
	}
`;

export const GET_PROJECT_DONORS = gql`
	query getProjDonorsByDonor($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		projDonors(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			donor {
				id
				name
				country {
					id
					name
				}
			}
			project {
				id
				name
			}
		}
	}
`;

export const GET_GRANT_PERIOD = gql`
	query getGrantPeriodsProjectByProjectDonor($filter: JSON) {
		grantPeriodsProjectList(where: $filter) {
			id
			name
			short_name
			start_date
			end_date
			description
			donor {
				id
				name
				short_name
				legal_name
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
			project {
				id
				name
				short_name
				description
			}
		}
	}
`;
export const GET_COUNTRY_LIST = gql`
	query {
		countries {
			id
			name
		}
	}
`;

export const GET_ORGANIZATION_REGISTRATION_TYPES = gql`
	query {
		organizationRegistrationTypes {
			id
			reg_type
		}
	}
`;

export const GET_CURRENCY_LIST = gql`
	query getCurrencyList($filter: JSON) {
		currencyList(where: $filter) {
			id
			name
			code
		}
	}
`;

export const GET_ORGANISATIONS_DOCUMENTS = gql`
	query {
		organizations {
			id
			name
			short_name
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

export const GET_STATE_LIST = gql`
	query getStates($where: JSON) {
		states(where: $where) {
			id
			name
			country {
				id
				name
			}
		}
	}
`;

export const GET_PROJECT_DOCUMENTS = gql`
	query getProjectDocuments($filter: JSON) {
		orgProject(where: $filter) {
			id
			name
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

export const GET_DISTRICT_LIST = gql`
	query getDistricts($where: JSON) {
		districts(where: $where) {
			id
			name
			state {
				id
				name
			}
		}
	}
`;

export const GET_VILLAGE_LIST = gql`
	query getDistricts($where: JSON) {
		districts(where: $where) {
			id
			name
			state {
				id
				name
			}
		}
	}
`;
