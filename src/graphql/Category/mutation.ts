import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
	mutation createYearTag($input: createYearTagInput) {
		createYearTag(input: $input) {
			yearTag {
				id
			}
		}
	}
`;

export const DELETE_CATEGORY = gql`
	mutation deleteYearTag($input: deleteYearTagInput) {
		deleteYearTag(input: $input) {
			yearTag {
				id
				name
			}
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation updateYearTag($input: updateYearTagInput) {
		updateYearTag(input: $input) {
			yearTag {
				id
				name
			}
		}
	}
`;
