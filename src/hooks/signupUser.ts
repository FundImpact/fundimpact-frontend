import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { IUserSignUp } from "../models";

export const useSignupNewUser = (body: IUserSignUp | null, dependency: any[]) => {
	console.log("body", body);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState(null);
	const [payload, setPayload] = useState(body);

	useEffect(() => {
		const url = "https://api.fundimpact.org/auth/local/register";
		postSignupData(payload as IUserSignUp, url, setLoading, setData, setError);
	}, [payload]);

	return { error, loading, data, setPayload };
};

const postSignupData = async (
	payload: IUserSignUp,
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
		let response: any = await sendPostRequest(url, payload);
		setLoading(false);

		if (response.status !== 200) {
			setResponseError(response, setData, setError);
			return;
		}

		if (response.success) {
			setData(response.data);
		} else setError(response);
	} catch (e) {
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
	setData: Dispatch<SetStateAction<null>>,
	setError: Dispatch<SetStateAction<string | null>>
) => {
	const message =
		response.message[0] && response.message[0].messages[0]
			? response.message[0].messages[0].message
			: "Failed to create user";
	setData(null);
	setError(`${message}`);
};
