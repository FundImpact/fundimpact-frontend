import { gql } from "@apollo/client";

export const CREATE_UNIT = gql`
	mutation createYearTag($input: createYearTagInput) {
		createYearTag(input: $input) {
			yearTag {
				id
			}
		}
	}
`;

export const DELETE_UNIT = gql`
	mutation deleteYearTag($input: deleteYearTagInput) {
		deleteYearTag(input: $input) {
			yearTag {
				id
				name
			}
		}
	}
`;

export const UPDATE_UNIT = gql`
	mutation updateYearTag($input: updateYearTagInput) {
		updateYearTag(input: $input) {
			yearTag {
				id
				name
			}
		}
	}
`;
