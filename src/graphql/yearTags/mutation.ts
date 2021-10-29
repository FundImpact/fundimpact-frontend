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

export const DELETE_YEAR_TAG = gql`
	mutation deleteYearTag($input: deleteYearTagInput) {
		deleteYearTag(input: $input) {
			yearTag {
				id
				name
			}
		}
	}
`;

export const UPDATE_YEAR_TAG = gql`
	mutation updateYearTag($input: updateYearTagInput) {
		updateYearTag(input: $input) {
			yearTag {
				id
				name
			}
		}
	}
`;
