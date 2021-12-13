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
			organization_id {
				id
				name
			}
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
				project_id {
					id
					name
				}
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
				organization_id {
					id
					name
				}
			}
		}
	}
`;

export const UPDATE_GEOREGIONS = gql`
	mutation updateGeoRegion($input: updateGeoRegionInput) {
		updateGeoRegion(input: $input) {
			geoRegion {
				id
				created_at
				updated_at
				name
				project_id {
					id
					name
				}
				is_active
				description
				country_id {
					id
					name
				}
				state_id {
					id
					name
				}
				district_id {
					id
					name
				}
				block_id {
					id
					name
				}
				village_id {
					id
					name
				}
				gp_id {
					id
					name
				}
				budget_sub_targets {
					id
					name
				}
				deliverable_sub_targets {
					id
					name
				}
				budget_tracking_lineitems {
					id
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
				project_id {
					id
					name
				}
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
