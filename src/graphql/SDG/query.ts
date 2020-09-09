import { gql } from "@apollo/client/core";

export const GET_SDG = gql`
	query getsustainableDevelopmentGoalList($filter: JSON) {
		sustainableDevelopmentGoalList(where: $filter) {
			id
			name
			short_name
			goal_no
			tags
			icon
		}
	}
`;
