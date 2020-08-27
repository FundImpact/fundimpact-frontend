import { gql } from "@apollo/client";

export const CREATE_ORG_DONOR = gql`
	mutation createOrgDonor($input: DonorInput!) {
		createOrgDonor(input: $input) {
			id
		}
	}
`;

export const UPDATE_ORG_DONOR = gql`
	mutation updateOrgDonor($id: ID!, $input: DonorInput) {
		updateOrgDonor(id: $id, input: $input) {
			id
      name
      country{
        id
        name
      }
      short_name
      legal_name
		}
	}
`;
