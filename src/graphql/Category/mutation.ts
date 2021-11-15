import { gql } from "@apollo/client";

// export const CREATE_CATEGORY = gql`
// 	mutation createDeliverableCategoryOrg($input: createDeliverableCategoryOrgInput) {
// 		createDeliverableCategoryOrg(input: $input) {
// 			deliverableCategoryOrg {
// 				id
// 				name
// 				code
// 				description
// 				project_id {
// 					id
// 					name
// 				}
// 			}
// 		}
// 	}
// `;

export const CREATE_CATEGORY = gql`
	mutation createCategory($input: createCategoryInput) {
		createCategory(input: $input) {
			category {
				id
				created_at
				updated_at
				name
				code
				description
				type
			}
		}
	}
`;

export const GET_CATEGORY_COUNT = gql`
	query getcategoryCount($sort: String, $limit: Int, $start: Int, $filter: JSON) {
		categoriesConnection(sort: $sort, limit: $limit, start: $start, where: $filter) {
			aggregate {
				count
			}
		}
	}
`;

// export const UPDATE_CATEGORY = gql`
// 	mutation updateDeliverableCategoryOrg($input: updateDeliverableCategoryOrgInput) {
// 		updateDeliverableCategoryOrg(input: $input) {
// 			deliverableCategoryOrg {
// 				id
// 				name
// 				code
// 				description
// 				organization {
// 					name
// 				}
// 				deleted
// 				project_id {
// 					name
// 				}
// 				deliverable_type_id {
// 					id
// 					name
// 				}
// 			}
// 		}
// 	}
// `;

export const UPDATE_CATEGORY = gql`
	mutation updateCategory($input: updateCategoryInput) {
		updateCategory(input: $input) {
			category {
				id
				created_at
				updated_at
				name
				code
				description
				type
			}
		}
	}
`;

// export const DELETE_CATEGORY = gql`
// 	mutation deleteDeliverableCategoryOrg($input: deleteDeliverableCategoryOrgInput) {
// 		deleteDeliverableCategoryOrg(input: $input) {
// 			deliverableCategoryOrg {
// 				id
// 				name
// 				code
// 				description
// 				organization {
// 					name
// 				}
// 				deleted
// 				project_id {
// 					name
// 				}
// 				deliverable_type_id {
// 					id
// 					name
// 				}
// 			}
// 		}
// 	}
// `;

export const DELETE_CATEGORY = gql`
	mutation deleteCategory($input: deleteCategoryInput) {
		deleteCategory(input: $input) {
			category {
				id
				created_at
				updated_at
				name
				code
				description
				type
			}
		}
	}
`;
