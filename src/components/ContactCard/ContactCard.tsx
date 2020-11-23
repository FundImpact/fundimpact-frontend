import { Box, Divider, Grid, IconButton, Paper, Typography, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import EditIcon from "@material-ui/icons/Edit";
import ContactForm from "../Forms/ContactDetails/ContactForm";
import { FORM_ACTIONS, Enitity_Name } from "../../models/constants";
import { IGetContact } from "../../models/contact/query";
// image

function ContactCard({
	contactDetails,
	entity_name,
}: {
	contactDetails: IGetContact["t4DContacts"][0];
	entity_name: Enitity_Name;
}) {
	const theme = useTheme();
	const [showContactEditDialog, setShowContactEditDialog] = useState<boolean>(false);

	return (
		<Paper elevation={24}>
			<ContactForm
				entity_id={contactDetails.entity_id}
				entity_name={entity_name}
				formAction={FORM_ACTIONS.UPDATE}
				open={showContactEditDialog}
				handleClose={() => setShowContactEditDialog(false)}
				initialValues={contactDetails}
			/>
			<Grid container>
				<Grid item xs={12} style={{ minHeight: "175px", position: "relative" }}>
					<img
						src="https://gadgetstouse.com/wp-content/uploads/2020/01/Restore-Google-Contacts.png"
						alt=""
						style={{ height: "100%", width: "100%" }}
					/>
					<Box p={2} pb={1} position="absolute" bottom="0" fontWeight="500">
						{/* text is on image so color is hardcoded to white */}
						<Typography variant="h5" style={{ color: "white" }}>
							Shubham
						</Typography>
					</Box>
					<Box position="absolute" bottom="-10%" right="0" px={2}>
						<IconButton
							style={{ background: theme.palette.primary.main }}
							size="medium"
							onClick={() => setShowContactEditDialog(true)}
						>
							<EditIcon fontSize="small" style={{ color: "white" }} />
						</IconButton>
					</Box>
				</Grid>
				<Grid item xs={12} style={{ display: "flex" }}>
					<Box p={2} pl={3}>
						<PhoneIcon
							fontSize="default"
							style={{ color: theme.palette.text.secondary }}
						/>
					</Box>
					<Box>
						{contactDetails?.phone_numbers.map((phone_number, idx) => (
							<Box p={1} key={idx}>
								<Typography>{phone_number?.value}</Typography>
								<Typography color="textSecondary">{phone_number?.label}</Typography>
							</Box>
						))}
					</Box>
				</Grid>
				<Box px={2} width="100%">
					<Divider />
				</Box>
				<Grid item xs={12} style={{ display: "flex" }}>
					<Box p={2} pl={3}>
						<MailIcon
							fontSize="default"
							style={{ color: theme.palette.text.secondary }}
						/>
					</Box>
					<Box>
						{contactDetails?.emails.map((email, idx) => (
							<Box p={1} key={idx}>
								<Typography>{email?.value}</Typography>
								<Typography color="textSecondary">{email?.label}</Typography>
							</Box>
						))}
					</Box>
				</Grid>
				<Box px={2} width="100%">
					<Divider />
				</Box>
				<Grid item xs={12} style={{ display: "flex" }}>
					<Box p={2} pl={3}>
						<LocationOnIcon
							fontSize="default"
							style={{ color: theme.palette.text.secondary }}
						/>
					</Box>
					<Box>
						{contactDetails.addresses.map((address, idx) => (
							<Box p={2} pl={1} pb={1} key={idx}>
								<Typography>
									{address?.address_line_1 + ", " + address?.address_line_2}
								</Typography>
								<Typography color="textSecondary">{address?.pincode}</Typography>
								<Typography color="textSecondary">{address?.city}</Typography>
							</Box>
						))}
					</Box>
				</Grid>
			</Grid>
		</Paper>
	);
}

export default ContactCard;
