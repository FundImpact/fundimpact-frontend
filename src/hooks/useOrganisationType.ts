import { IOrganisationType } from "../models/organisation/types";
import { useGetFetch } from "./useFetch";

export const useOrganisationTypes = (
	url = "https://api.fundimpact.org/organisation-registration-types"
) => {
	return useGetFetch<IOrganisationType[]>({ url });
};
