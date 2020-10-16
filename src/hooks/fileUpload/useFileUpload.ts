import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { useAuth } from "../../contexts/userContext";
import { FILE_UPLOAD } from "../../utils/endpoints.util";
import { setResponseError } from "../fetch/usePostFetch";

export const useFileUpload = <T>() => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [data, setData] = useState<T>();

	const { jwt } = useAuth();

	const uploadFile = useCallback(
		async (payload) => {
			const response = await intiatePostRequest(payload, setLoading, setData, setError, jwt);
			return response;
		},
		[jwt, setLoading, setData, setError]
	);

	return { error, loading, data, uploadFile };
};

const intiatePostRequest = async (
	payload: any,
	setLoading: Dispatch<SetStateAction<any>>,
	setData: Dispatch<SetStateAction<any>>,
	setError: Dispatch<SetStateAction<any>>,
	jwt?: string
) => {
	if (!payload) {
		return;
	}
	setLoading(true);
	try {
		let response: any = await sendPostRequest(payload, jwt);
		setLoading(false);

		if (response.statusCode && response.statusCode !== 200) {
			setResponseError(response, setData, setError);
			return;
		}

		if (response) {
			setData(response);
			return response;
		} else setError(response);
	} catch (e) {
		console.error(e);
		setData(null);
		setError(e);
		setLoading(false);
	}
};

const sendPostRequest = async (payload: any, jwt?: string) => {
	const headers = new Headers();
	if (jwt) {
		headers.append("Authorization", `Bearer ${jwt}`);
	}

	let response: any = await fetch(`${FILE_UPLOAD}`, {
		method: "POST",
		headers,
		body: payload,
	});
	return response.json();
};
