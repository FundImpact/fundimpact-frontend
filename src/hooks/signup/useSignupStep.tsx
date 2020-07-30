import React from "react";
import { matchPath, useLocation, useNavigate } from "react-router-dom";

import { SignUpSteps } from "../../utils/signup.util";

/**
 *
 * @param id SignUp param id to get current Step
 */
export default function useSignUpStep(
	id: string | undefined
): { currentStep: number; setStep: Function } {
	const [step, setStep] = React.useState<number>(0);
	const navigate = useNavigate();
	const location = useLocation();
	const signUpPathMatch = matchPath("signup/:id", location.pathname);

	React.useEffect(() => {
		if (signUpPathMatch || location.pathname === "/signup") {
			switch (id) {
				case SignUpSteps.SET_BASIC_INFO:
					setStep(0);
					break;
				case SignUpSteps.SET_ORG:
					setStep(1);
					break;
				case SignUpSteps.SET_PROJECT:
					setStep(3);
					break;
				case SignUpSteps.SET_WORKSPACE:
					setStep(2);
					break;
				default:
					setStep(0);
					navigate(`/signup/${SignUpSteps.SET_BASIC_INFO}`);
			}
		}
	}, [signUpPathMatch, location.pathname, navigate, id]);
	return { currentStep: step, setStep };
}
