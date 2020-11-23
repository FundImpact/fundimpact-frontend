import React, { useEffect, useState } from "react";
import UserForm from "../../../components/Forms/User";
import PasswordReset from "../../../components/Forms/ResetPassword";
import { Box, Button, Paper, ButtonGroup } from "@material-ui/core";
import { useAuth, UserDispatchContext } from "../../../contexts/userContext";
import { FORM_ACTIONS, Enitity_Name } from "../../../models/constants";
import { FormattedMessage } from "react-intl";
import { useLocation } from "react-router";
import { useQuery } from "@apollo/client";
import { GET_USER_DETAILS } from "../../../graphql/User/query";
import { setUser } from "../../../reducers/userReducer";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AddContactAddressDialog from "../../../components/AddContactAddressDialog";
import ContactListDialog from "../../../components/ContactListDialog";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { CONTACT_ACTION } from "../../../utils/access/modules/contact/actions";
import ContactForm from "../../../components/Forms/ContactDetails/ContactForm";

export const ProfileContainer = () => {
	const [contactDialogOpen, setContactDialogOpen] = useState<boolean>(false);
	const [contactListDialogOpen, setContactListDialogOpen] = useState<boolean>(false);
	const auth = useAuth();
	const user: any = auth.user;
	const data = {
		id: user?.id,
		name: user?.name,
		email: user?.email,
		// username: user?.username,
		theme: user?.theme,
		profile_photo: user?.profile_photo?.id,
		logo: user?.profile_photo?.url,
		uploadPhoto: "",
		language: user?.language,
	};
	const [openResetPassForm, setOpenResetPassForm] = useState<boolean>(false);
	const userDispatch = React.useContext(UserDispatchContext);
	let { data: userDetails, error: userDetailsError } = useQuery(GET_USER_DETAILS);

	let verifyUrlJwt = false;
	let { pathname } = useLocation();

	let pathnameArr = pathname.split("/");
	if (pathnameArr?.length > 3) {
		if (pathnameArr[3] === "verify") verifyUrlJwt = true;
	}

	const contactCreateAccess = userHasAccess(MODULE_CODES.CONTACT, CONTACT_ACTION.CREATE_CONTACT);

	const contactFindAccess = userHasAccess(MODULE_CODES.CONTACT, CONTACT_ACTION.FIND_CONTACT);

	useEffect(() => {
		if (verifyUrlJwt) {
			if (userDetailsError) {
				/*Invalid Token or forbidden*/
				if (userDispatch) {
					userDispatch({
						type: "LOGOUT_USER",
						payload: { logoutMsg: "Invalid user or user dont have access" },
					});
				}
			}
			if (userDetails?.userCustomer) {
				if (userDispatch) {
					console.log("heree", userDetails?.userCustomer);
					userDispatch(setUser({ user: userDetails?.userCustomer }));
				}
			}
		}
	}, [userDetails, userDispatch, userDetailsError, verifyUrlJwt]);
	return (
		<Box>
			<h1>
				<FormattedMessage
					id={`profileHeading`}
					defaultMessage={`Profile`}
					description={`This text will be shown on Setting page for profile heading`}
				/>
			</h1>
			<Paper>
				<Box m={3} p={2}>
					<UserForm
						data={data}
						type={FORM_ACTIONS.UPDATE}
						updateWithToken={verifyUrlJwt}
					/>
				</Box>
			</Paper>
			{!verifyUrlJwt && (
				<Box m={1}>
					<ButtonGroup
						color="primary"
						variant="contained"
						aria-label="outlined primary button group"
					>
						<Button onClick={() => setOpenResetPassForm(true)}>
							<FormattedMessage
								id={`profileResetPassword`}
								defaultMessage={`Reset Password`}
								description={`This text will be shown on Setting page for reset password button`}
							/>
						</Button>
						{contactCreateAccess && (
							<Button
								startIcon={<PersonAddIcon />}
								onClick={() => setContactDialogOpen(true)}
							>
								<FormattedMessage
									id={`addContactButton`}
									defaultMessage={`Add Contact`}
									description={`This text will be shown on add contact button`}
								/>
							</Button>
						)}
						{contactFindAccess && (
							<Button fullWidth onClick={() => setContactListDialogOpen(true)}>
								<FormattedMessage
									id={`showContactList`}
									defaultMessage={`Contacts Details`}
									description={`This text will be shown on show contact button`}
								/>
							</Button>
						)}
					</ButtonGroup>
				</Box>
			)}
			{openResetPassForm && (
				<PasswordReset
					open={openResetPassForm}
					handleClose={() => setOpenResetPassForm(false)}
					userId={data?.id}
					type={FORM_ACTIONS.UPDATE}
				/>
			)}
			<ContactForm
				open={contactDialogOpen}
				handleClose={() => setContactDialogOpen(false)}
				entity_id={data?.id || ""}
				entity_name={Enitity_Name.user}
				formAction={FORM_ACTIONS.CREATE}
			/>
			<ContactListDialog
				open={contactListDialogOpen}
				handleClose={() => setContactListDialogOpen(false)}
				entity_name={Enitity_Name.user}
				entity_id={data?.id || ""}
			/>
		</Box>
	);
};
