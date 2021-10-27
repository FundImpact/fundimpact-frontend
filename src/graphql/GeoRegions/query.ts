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
			is_active
		}
	}
`;

export const CREATE_GEOREGIONS = gql`
	mutation createGeographiesCountry($input: createGeoRegionInput) {
		createGeoRegion(input: $input) {
			geoRegion {
				name
				description
			}
		}
	}
`;
