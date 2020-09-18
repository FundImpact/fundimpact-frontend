import { useIntl } from "react-intl";
import { DELIVERABLE_ACTIONS } from "../components/Deliverable/constants";
import { IMPACT_ACTIONS } from "../components/Impact/constants";
import { FORM_ACTIONS } from "../models/constants";
import React, { useState } from "react";

function CommonFormTitleFormattedMessage(formAction: any) {
	const intl = useIntl();
	const [newOrEdit, setNewOrEdit] = useState<React.ReactNode>();
	if (
		formAction === (FORM_ACTIONS.UPDATE || DELIVERABLE_ACTIONS.UPDATE || IMPACT_ACTIONS.UPDATE)
	) {
		setNewOrEdit(
			intl.formatMessage({
				id: "editFormHeading",
				defaultMessage: "Edit",
				description: `This text will be show on forms for Edit`,
			})
		);
	} else {
		setNewOrEdit(
			intl.formatMessage({
				id: "newFormHeading",
				defaultMessage: "New",
				description: `This text will be show on forms for New`,
			})
		);
	}
	return {
		newOrEdit,
	};
}

export { CommonFormTitleFormattedMessage };
