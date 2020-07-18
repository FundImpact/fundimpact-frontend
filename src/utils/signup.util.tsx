import { ISignUpStep } from "../models";

export enum SignUpSteps {
	SET_BASIC_INFO = "basicInfo",
	SET_ORG = "orgSetup",
	SET_WORKSPACE = "setWorkspace",
	SET_PROJECT = "setProject",
}

export function getSteps(): ISignUpStep[] {
	return [
		{
			label: "Sign Up",
			step: 0,
			id: SignUpSteps.SET_BASIC_INFO,
			description: "Get started in minutes",
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
