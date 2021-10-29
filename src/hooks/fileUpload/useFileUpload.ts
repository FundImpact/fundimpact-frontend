import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { useAuth } from "../../contexts/userContext";
import { FILE_UPLOAD, FILE_UPLOAD_MORPH } from "../../utils/endpoints.util";
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
		async (payload, index?: number, update?: boolean) => {
			const response = await intiatePostRequest(
				payload,
				setLoading,
				setData,
				setError,
				setLoadingStatus,
				index,
				jwt,
				update
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
	jwt?: string,
	update?: boolean
) => {
	if (!payload) {
		return;
	}
	setLoading(true);
	try {
		let response: any = await sendPostRequest(payload, jwt, setLoadingStatus, index, update);
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
	index?: number,
	update?: boolean
) => {
	const headers = new Headers();
	if (jwt) {
		headers.append("Authorization", `Bearer ${jwt}`);
	}

	const config = {
		params: update ? payload : {},
		headers: {
			...headers,
			Authorization: `Bearer ${jwt}`,
		},
		onUploadProgress: update
			? () => {}
			: (progressEvent: any) => {
					if (setLoadingStatus) {
						setLoadingStatus({
							index: index,
							loaded: progressEvent.loaded,
							total: progressEvent.total,
						});
					}
			  },
	};

	let formData = payload;

	let response = await axios.post(
		`${update ? FILE_UPLOAD_MORPH : FILE_UPLOAD}`,
		update ? {} : formData,
		config
	);
	return response?.data;
};
