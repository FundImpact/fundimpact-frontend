import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ILoginForm, IUserSignUp } from "../models";

export const useLogin = (
	body: ILoginForm | null,
	url = "https://api.fundimpact.org/auth/local"
) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState(null);
	const [payload, setPayload] = useState(body);

	useEffect(() => {
		postSignupData(payload as IUserSignUp, url, setLoading, setData, setError);
	}, [payload, url]);

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
		let response = await sendPostRequest(url, payload);
		setLoading(false);
		if (response.status && response.status !== 200) {
			setResponseError(await response.json(), setData, setError);
			return;
		}
		const data = await response.json();

		console.log(`loginData `, data);

		setData(data);
	} catch (e) {
		setData(null);
		setError(`Server Error. Failed to authenticate.`);
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
			: "Failed to create user";
	setData(null);
	setError(`${message}`);
};
