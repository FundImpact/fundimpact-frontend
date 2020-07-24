import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { IOrganisationType } from "../models/organisation/types";

export const useOrganisationTypes = (
	url = "https://api.fundimpact.org/organisation-registration-types"
) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<IOrganisationType[]>();

	useEffect(() => {
		getOrganisationTypes(url, setLoading, setData, setError);
	}, [url]);

	return { error, loading, data };
};

const getOrganisationTypes = async (
	url: string,
	setLoading: Dispatch<SetStateAction<any>>,
	setData: Dispatch<SetStateAction<any>>,
	setError: Dispatch<SetStateAction<any>>
) => {
	setLoading(true);
	try {
		let response = await getRequest(url);
		setLoading(false);
		if (response.status !== 200) {
			setResponseError(await response.json(), setData, setError);
			return;
		}
		const data = await response.json();

		setData(data);
	} catch (e) {
		setData(null);
		setError(`Server Error.`);
		setLoading(false);
	}
};

const getRequest = async (url: string) => {
	const headers = new Headers({
		"Content-Type": "application/json; charset=utf-8",
	});
	let response: any = await fetch(`${url}`, {
		method: "GET",
		headers,
	});

	return response;
};

const setResponseError = (
	response: any,
	setData: Dispatch<SetStateAction<null>>,
	setError: Dispatch<SetStateAction<string | null>>
) => {
	const message =
		response.message[0] && response.message[0].messages[0]
			? response.message[0].messages[0].message
			: "Failed to fetch organisation list";
	setData(null);
	setError(`${message}`);
};
