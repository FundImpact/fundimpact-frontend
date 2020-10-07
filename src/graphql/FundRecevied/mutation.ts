import { gql } from "@apollo/client";

export const CREATE_FUND_RECEIPT = gql`
	mutation createFundReceiptProjectInput($input: FundReceiptProjectInput!) {
		createFundReceiptProjectInput(input: $input) {
			id
			amount
			reporting_date
		}
	}
`;
