import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { IUserSignUp } from "../../models";

export const usePostFetch = <T>({ body = null, url }: { body: any; url: string }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [data, setData] = useState<T>();
	const [payload, setPayload] = useState(body);

	useEffect(() => {
		intiatePostRequest(payload, url, setLoading, setData, setError);
	}, [payload, url]);

	return { error, loading, data, setPayload };
};

const intiatePostRequest = async (
	payload: any,
	url: string,
	setLoading: Dispatch<SetStateAction<any>>,
	setData: Dispatch<SetStateAction<any>>,
	setError: Dispatch<SetStateAction<any>>
) => {
	if (!payload) {
		return;
	}
	setLoading(true);
	try {
		if (!url) return setData(null);
		let response: any = await sendPostRequest(url, payload);
		setLoading(false);

		if (response.statusCode && response.statusCode !== 200) {
			setResponseError(response, setData, setError);
			return;
		}

		if (response) {
			setData(response);
		} else setError(response);
	} catch (e) {
		console.error(e);
		setData(null);
		setError(e);
		setLoading(false);
	}
};

const sendPostRequest = async (url: string, payload: IUserSignUp) => {
	const headers = new Headers({
		"Content-Type": "application/json; charset=utf-8",
	});
	let response: any = await fetch(`${url}`, {
		method: "POST",
		headers,
		body: JSON.stringify(payload),
	});
	return response.json();
};

const setResponseError = (
	response: any,
	setData: Dispatch<SetStateAction<any>>,
	setError: Dispatch<SetStateAction<string | null>>
) => {
	const message =
		response.message[0] && response.message[0].messages[0]
			? response.message[0].messages[0].message
			: "Failed to create user";
	setData(null);
	setError(`${message}`);
};
