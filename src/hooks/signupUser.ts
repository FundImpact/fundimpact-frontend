import { IUserSignUp } from "../models";
import { IUserSignupResponse } from "../models/signup/userSignUpResponse";
import { usePostFetch } from "./usePostFetch";

export const useSignupNewUser = (body?: IUserSignUp) => {
	const url = "https://api.fundimpact.org/auth/local/register";

	return usePostFetch<IUserSignupResponse>({ body, url });
};
