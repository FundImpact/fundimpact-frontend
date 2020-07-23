import { Dispatch, SetStateAction } from "react";

export interface IBaseRequest {
	url: string;
	headers?: Headers;
}

export interface IPostRequest<T> extends IBaseRequest {
	body: T;
	setLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setData: Dispatch<SetStateAction<T>>;
}

export interface IGetRequest<T> extends IBaseRequest {
	setLoading: Dispatch<SetStateAction<boolean>>;
	setError: Dispatch<SetStateAction<string | null>>;
	setData: Dispatch<SetStateAction<T>>;
}
