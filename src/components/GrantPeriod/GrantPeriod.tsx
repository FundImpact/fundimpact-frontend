import { useMutation } from "@apollo/client";
import React from "react";

import { useDashBoardData } from "../../contexts/dashboardContext";
import { useNotificationDispatch } from "../../contexts/notificationContext";
import { CREATE_GRANT_PERIOD } from "../../graphql/grantPeriod/mutation";
import { FORM_ACTIONS } from "../../models/constants";
import { GrantPeriodDialogProps } from "../../models/grantPeriod/grantPeriodDialog";
import { IGrantPeriod } from "../../models/grantPeriod/grantPeriodForm";
import { setSuccessNotification } from "../../reducers/notificationReducer";
import FormDialog from "../FormDialog";
import { GranPeriodForm } from "../Forms/GrantPeriod/GranPeriod";

function GrantPeriodDialog({ open, onClose, action }: GrantPeriodDialogProps) {
	const dashboardData = useDashBoardData();
	const notificationDispatch = useNotificationDispatch();

	const onCancel = () => {
		console.log("cancel is called");
	};

	const [createGrantPeriod, { loading }] = useMutation(CREATE_GRANT_PERIOD, {
		onCompleted: (data) => {
			console.log(`created data`, data);
			notificationDispatch(setSuccessNotification("Grant Period Created."));
			onClose();
		},
	});

	const onSubmit = (value: IGrantPeriod) => {
		console.log("submitted");
		console.log(value);
		createGrantPeriod({ variables: { input: { ...value } } });
	};
	return (
		<div>
			<FormDialog
				open={open}
				loading={loading}
				title={"Grant Period"}
				subtitle={"Grant Period for the project"}
				workspace={dashboardData?.workspace?.name || ""}
				handleClose={onClose}
				project={dashboardData?.project?.name || ""}
			>
				<GranPeriodForm
					action={FORM_ACTIONS.CREATE}
					onCancel={onCancel}
					onSubmit={onSubmit}
				/>
			</FormDialog>
		</div>
	);
}

export default GrantPeriodDialog;
