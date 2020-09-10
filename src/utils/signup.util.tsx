import React from "react";
import { FormattedMessage } from "react-intl";

import { IBasicInformation, ISignUpStep } from "../models";

export enum SignUpSteps {
	SET_BASIC_INFO = "basicInfo",
	SET_ORG = "orgSetup",
	SET_WORKSPACE = "setWorkspace",
	SET_PROJECT = "setProject",
}

export function getSteps(): ISignUpStep[] {
	return [
		{
			label: (
				<FormattedMessage
					id="signupLabel"
					defaultMessage="Singup"
					description="This text will be show on signup page on left side over blue cover"
				/>
			),
			step: 0,
			id: SignUpSteps.SET_BASIC_INFO,
			description: (
				<FormattedMessage
					id="signupDescription"
					defaultMessage="Get started in minutes"
					description="This text will be show on signup page on left side over blue cover"
				/>
			),
		},
		{
			label: "Setup Organisation",
			step: 1,
			id: SignUpSteps.SET_ORG,
			description: "Provide details about your organisation",
		},
		{ label: "Setup WorkSpace", step: 2, id: SignUpSteps.SET_WORKSPACE },
		{ label: "Setup Project", step: 3, id: SignUpSteps.SET_PROJECT },
	];
}

export const getDefaultBasicInformation = (): IBasicInformation => {
	return {
		email: "",
		password: "",
		provider: "local",
		organization: {
			name: "",
			legal_name: "",
			short_name: "",
			description: "",
			type: "",
			country: "",
		},
	};
};
