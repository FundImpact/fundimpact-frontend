import { gql } from "@apollo/client";

export const CREATE_CATEGORY = gql`
	mutation createCategory($input: createCategoryInput) {
		createCategory(input: $input) {
			category {
				id
				name
				code
				description
				type
			}
		}
	}
`;

export const UPDATE_CATEGORY = gql`
	mutation updateCategory($input: updateCategoryInput) {
		updateCategory(input: $input) {
			category {
				id
				name
				code
				description
				type
			}
		}
	}
`;

export const DELETE_CATEGORY = gql`
	mutation deleteCategory($input: deleteCategoryInput) {
		deleteCategory(input: $input) {
			category {
				id
				name
				code
				description
				type
			}
		}
	}
`;
