import { gql } from "@apollo/client";

export const CREATE_YEAR_TAG = gql`
	mutation createYearTag($input: createYearTagInput) {
		createYearTag(input: $input) {
			yearTag {
				id
			}
		}
	}
`;
