import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { useAuth } from "../../contexts/userContext";
import { FILE_UPLOAD } from "../../utils/endpoints.util";
import { setResponseError } from "../fetch/usePostFetch";
import axios from "axios";
export const useFileUpload = <T>() => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [data, setData] = useState<T>();
	const [loadingStatus, setLoadingStatus] = useState<
		| {
				index: number;
				loaded: number;
				total: number;
		  }
		| undefined
	>();

	const { jwt } = useAuth();

	const uploadFile = useCallback(
		async (payload, index?: number) => {
			const response = await intiatePostRequest(
				payload,
				setLoading,
				setData,
				setError,
				setLoadingStatus,
				index,
				jwt
			);
			return response;
		},
		[jwt, setLoading, setData, setError]
	);

	return { error, loading, data, uploadFile, loadingStatus };
};

const intiatePostRequest = async (
	payload: any,
	setLoading: Dispatch<SetStateAction<any>>,
	setData: Dispatch<SetStateAction<any>>,
	setError: Dispatch<SetStateAction<any>>,
	setLoadingStatus: Dispatch<SetStateAction<any>>,
	index?: number,
	jwt?: string
) => {
	if (!payload) {
		return;
	}
	setLoading(true);
	try {
		let response: any = await sendPostRequest(payload, jwt, setLoadingStatus, index);
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

// const sendPostRequest = async (payload: any, jwt?: string) => {
// 	const headers = new Headers();
// 	if (jwt) {
// 		headers.append("Authorization", `Bearer ${jwt}`);
// 	}
// 	const config = {
// 		onUploadProgress: (progressEvent: any) => console.log(progressEvent.loaded),
// 	};

// 	let response: any = await fetch(`${FILE_UPLOAD}`, {
// 		method: "POST",
// 		headers,
// 		body: payload,

// 	});
// 	return response.json();
// };

const sendPostRequest = async (
	payload: any,
	jwt?: string,
	setLoadingStatus?: Dispatch<SetStateAction<any>>,
	index?: number
) => {
	const headers = new Headers();
	if (jwt) {
		headers.append("Authorization", `Bearer ${jwt}`);
	}

	const config = {
		headers: {
			...headers,
			Authorization: `Bearer ${jwt}`,
		},
		onUploadProgress: (progressEvent: any) => {
			if (setLoadingStatus) {
				setLoadingStatus({
					index: index,
					loaded: progressEvent.loaded,
					total: progressEvent.total,
				});
			}
			console.log(progressEvent.loaded + " " + progressEvent.total);
		},
	};

	let formData = payload;
	let response = await axios.post(`${FILE_UPLOAD}`, formData, config);
	return response?.data;
};
