import { gql } from "@apollo/client";

export const GET_GEOREGIONS_DATA = gql`
	query getGeoregions($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		geoRegions(sort: $sort, limit: $limit, start: $start, where: $filter) {
			id
			name
			project_id {
				id
				name
			}
			description
			is_active
		}
	}
`;

export const GET_GEOREGIONS_COUNT = gql`
	query getgeoregionCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		geoRegionsConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;

export const CREATE_GEOREGIONS = gql`
	mutation createGeoRegions($input: createGeoRegionInput) {
		createGeoRegion(input: $input) {
			geoRegion {
				id
				created_at
				updated_at
				name
				description
				country_id {
					name
				}
				state_id {
					name
				}
				district_id {
					name
				}
				block_id {
					name
				}
				village_id {
					name
				}
				gp_id {
					name
				}
			}
		}
	}
`;

export const UPDATE_GEOREGIONS = gql`
	mutation createGeoRegions($input: updateGeoRegionInput) {
		updateGeoRegion(input: $input) {
			geoRegion {
				id
				created_at
				updated_at
				name
				description
				country_id {
					name
				}
				state_id {
					name
				}
				district_id {
					name
				}
				block_id {
					name
				}
				village_id {
					name
				}
				gp_id {
					name
				}
			}
		}
	}
`;

export const DELETE_GEOREGIONS = gql`
	mutation deleteGeoRegions($input: deleteGeoRegionInput) {
		deleteGeoRegion(input: $input) {
			geoRegion {
				id
				created_at
				updated_at
				name
				description
				country_id {
					name
				}
				state_id {
					name
				}
				district_id {
					name
				}
				block_id {
					name
				}
				village_id {
					name
				}
				gp_id {
					name
				}
			}
		}
	}
`;
