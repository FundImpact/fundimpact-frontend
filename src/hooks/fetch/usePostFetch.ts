import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from "../../contexts/userContext";

import { IUserSignUp } from "../../models";

export const usePostFetch = <T>({
	body = null,
	url,
	initiateRequest = true,
}: {
	body: any;
	url: string;
	initiateRequest?: boolean;
}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [data, setData] = useState<T>();
	const [payload, setPayload] = useState(body);
	const { jwt } = useAuth();

	useEffect(() => {
		if (initiateRequest) {
			intiatePostRequest(payload, url, setLoading, setData, setError, jwt);
			setError("");
		}
	}, [payload, url, initiateRequest]);

	return { error, loading, data, setPayload };
};

const intiatePostRequest = async (
	payload: any,
	url: string,
	setLoading: Dispatch<SetStateAction<any>>,
	setData: Dispatch<SetStateAction<any>>,
	setError: Dispatch<SetStateAction<any>>,
	jwt: undefined | string
) => {
	if (!payload) {
		return;
	}
	setLoading(true);
	try {
		if (!url) return setData(null);
		let response: any = await sendPostRequest(url, payload, jwt);
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

const sendPostRequest = async (url: string, payload: IUserSignUp, jwt?: string) => {
	const headers = new Headers({
		"Content-Type": "application/json; charset=utf-8",
	});

	if (jwt) {
		headers.append("Authorization", `Bearer ${jwt}`);
	}

	let response: any = await fetch(`${url}`, {
		method: "POST",
		headers,
		body: JSON.stringify(payload),
	});
	return response.json();
};

export const setResponseError = (
	response: any,
	setData: Dispatch<SetStateAction<any>>,
	setError: Dispatch<SetStateAction<string | null>>
) => {
	const message =
		response?.message?.[0] && response?.message?.[0]?.messages?.[0]
			? response?.message?.[0]?.messages[0]?.message
			: "Internal Server Error 500";
	setData(null);
	setError(`${message}`);
};
