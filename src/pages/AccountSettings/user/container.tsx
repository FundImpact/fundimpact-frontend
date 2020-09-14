import React, { useState } from "react";
import UserForm from "../../../components/Forms/User";
import PasswordReset from "../../../components/Forms/ResetPassword";
import { Box, Button, Paper } from "@material-ui/core";
import { useAuth } from "../../../contexts/userContext";
import { FORM_ACTIONS } from "../../../models/constants";
import { FormattedMessage } from "react-intl";

export const ProfileContainer = () => {
	const auth = useAuth();
	const user: any = auth.user;
	const data = {
		id: user?.id,
		name: user?.name,
		email: user?.email,
		username: user?.username,
	};
	const [openResetPassForm, setOpenResetPassForm] = useState<boolean>(false);
	return (
		<Box>
			<h1>
				<FormattedMessage
					id={`profileHeading`}
					defaultMessage={`Profile`}
					description={`This text will be shown on Setting page for profile heading`}
				/>
			</h1>
			<Paper style={{ height: "30vh" }}>
				<Box m={3} p={2}>
					<UserForm data={data} type={FORM_ACTIONS.UPDATE} />
				</Box>
			</Paper>
			<Box m={1}>
				<Button color="primary" onClick={() => setOpenResetPassForm(!openResetPassForm)}>
					<FormattedMessage
						id={`profileResetPassword`}
						defaultMessage={`ResetPassword`}
						description={`This text will be shown on Setting page for reset password button`}
					/>
				</Button>
			</Box>
			{openResetPassForm && (
				<Paper style={{ height: "30vh" }}>
					<Box m={2} p={3}>
						<PasswordReset userId={data?.id} type={FORM_ACTIONS.UPDATE} />
					</Box>
				</Paper>
			)}
		</Box>
	);
};
