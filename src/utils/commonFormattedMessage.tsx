import { useIntl } from "react-intl";
import { DELIVERABLE_ACTIONS } from "../components/Deliverable/constants";
import { IMPACT_ACTIONS } from "../components/Impact/constants";
import { FORM_ACTIONS } from "../models/constants";

function CommonFormTitleFormattedMessage(formAction: any) {
	const intl = useIntl();
	// const [newOrEdit, setNewOrEdit] = useState<React.ReactNode>();
	let newOrEdit;
	if (
		formAction === (FORM_ACTIONS.UPDATE || DELIVERABLE_ACTIONS.UPDATE || IMPACT_ACTIONS.UPDATE)
	) {
		newOrEdit = intl.formatMessage({
			id: "editFormHeading",
			defaultMessage: "Edit",
			description: `This text will be show on forms for Edit`,
		});
	} else {
		newOrEdit = intl.formatMessage({
			id: "newFormHeading",
			defaultMessage: "New",
			description: `This text will be show on forms for New`,
		});
	}
	return {
		newOrEdit,
	};
}
function CommonUploadingFilesMessage() {
	const intl = useIntl();
	let uploadingFilesMessage = intl.formatMessage({
		id: "uploadingFilesMessage",
		defaultMessage: "Uploading Files",
		description: `This text will be show on loading for uploadng files`,
	});
	return uploadingFilesMessage;
}

export { CommonFormTitleFormattedMessage, CommonUploadingFilesMessage };
