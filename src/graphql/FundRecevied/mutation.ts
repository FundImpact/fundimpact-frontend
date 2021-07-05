import { gql } from "@apollo/client";

export const CREATE_FUND_RECEIPT = gql`
	mutation createFundReceiptProjectInput($input: FundReceiptProjectInput!) {
		createFundReceiptProjectInput(input: $input) {
			id
			amount
			reporting_date
			project_donor {
				donor {
					name
				}
			}
			project {
				id
			}
			donor {
				id
			}
		}
	}
`;

export const UPDATE_FUND_RECEIPT = gql`
	mutation updateFundReceiptProjectInput($id: ID!, $input: FundReceiptProjectInput!) {
		updateFundReceiptProjectInput(id: $id, input: $input) {
			id
			amount
			reporting_date
			deleted
			project_donor {
				donor {
					name
					deleted
				}
			}
			project {
				id
			}
			donor {
				id
			}
		}
	}
`;
