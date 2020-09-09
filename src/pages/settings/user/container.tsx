import React from "react";
import UserForm from "../../../components/Forms/User";
import { Box, Paper } from "@material-ui/core";
import { useAuth } from "../../../contexts/userContext";
import { FORM_ACTIONS } from "../../../models/constants";

export const PaperContainer = () => {
	const auth = useAuth();
	const user: any = auth.user;
	const data = {
		id: user?.id,
		name: user?.name,
		email: user?.email,
		username: user?.username,
	};
	return (
		<Box>
			<Paper>
				<Box m={3} p={2}>
					<UserForm data={data} type={FORM_ACTIONS.UPDATE} />
				</Box>
			</Paper>
		</Box>
	);
};
