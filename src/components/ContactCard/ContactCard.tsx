import {
	Box,
	Collapse,
	Divider,
	Grid,
	IconButton,
	Paper,
	Typography,
	useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import EditIcon from "@material-ui/icons/Edit";
import ContactDialog from "../ContactDialog";
import { FORM_ACTIONS, Entity_Name } from "../../models/constants";
import { IGetContact } from "../../models/contact/query";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import contactImage from "../../assets/images/contact.png";

function ContactCard({
	contactDetails,
	entity_name,
}: {
	contactDetails: IGetContact["t4DContacts"][0];
	entity_name: Entity_Name;
}) {
	const theme = useTheme();
	const [showContactEditDialog, setShowContactEditDialog] = useState<boolean>(false);
	const [contactPhoneExpanded, setContactPhoneExpanded] = React.useState(false);
	const [contactAddressExpanded, setContactAddressExpanded] = React.useState(false);
	const [contactEmailExpanded, setContactEmailExpanded] = React.useState(false);

	return (
		<Paper elevation={24}>
			<ContactDialog
				entity_id={contactDetails.entity_id}
				entity_name={entity_name}
				formAction={FORM_ACTIONS.UPDATE}
				open={showContactEditDialog}
				handleClose={() => setShowContactEditDialog(false)}
				initialValues={contactDetails}
			/>
			<Grid container>
				<Grid item xs={12} style={{ minHeight: "175px", position: "relative" }}>
					<img src={contactImage} alt="" style={{ height: "100%", width: "100%" }} />
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
						<Box p={1}>
							<Typography>{contactDetails?.phone_numbers[0]?.value}</Typography>
							<Typography color="textSecondary">
								{contactDetails?.phone_numbers[0]?.label}
							</Typography>
						</Box>
						<Collapse in={contactPhoneExpanded} timeout="auto" unmountOnExit>
							{contactDetails?.phone_numbers?.slice(1)?.map((phone_number, idx) => (
								<Box p={1} key={idx}>
									<Typography>{phone_number?.value}</Typography>
									<Typography color="textSecondary">
										{phone_number?.label}
									</Typography>
								</Box>
							))}
						</Collapse>
					</Box>
					{contactDetails?.phone_numbers?.length > 1 && (
						<Box style={{ marginLeft: "auto" }} p={3} pb={0}>
							<IconButton
								size="small"
								onClick={() => setContactPhoneExpanded(!contactPhoneExpanded)}
							>
								{contactPhoneExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							</IconButton>
						</Box>
					)}
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
						<Box p={1}>
							<Typography>{contactDetails?.emails[0]?.value}</Typography>
							<Typography color="textSecondary">
								{contactDetails?.emails[0]?.label}
							</Typography>
						</Box>
						<Collapse in={contactEmailExpanded} timeout="auto" unmountOnExit>
							{contactDetails?.emails?.slice(1)?.map((email, idx) => (
								<Box p={1} key={idx}>
									<Typography>{email?.value}</Typography>
									<Typography color="textSecondary">{email?.label}</Typography>
								</Box>
							))}
						</Collapse>
					</Box>
					{contactDetails?.emails?.length > 1 && (
						<Box style={{ marginLeft: "auto" }} p={3} pb={0}>
							<IconButton
								size="small"
								onClick={() => setContactEmailExpanded(!contactEmailExpanded)}
							>
								{contactEmailExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							</IconButton>
						</Box>
					)}
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
						<Box p={2} pl={1} pb={1}>
							<Typography>{contactDetails?.addresses[0]?.address_line_1}</Typography>
							<Typography>{contactDetails?.addresses[0]?.address_line_2}</Typography>
							<Typography color="textSecondary">
								{contactDetails?.addresses[0]?.pincode}
							</Typography>
							<Typography color="textSecondary">
								{contactDetails?.addresses[0]?.city}
							</Typography>
						</Box>
						<Collapse in={contactAddressExpanded} timeout="auto" unmountOnExit>
							{contactDetails?.addresses?.slice(1).map((address, idx) => (
								<Box p={2} pl={1} pb={1} key={idx}>
									<Typography>{address?.address_line_1}</Typography>
									<Typography>{address?.address_line_2}</Typography>
									<Typography color="textSecondary">
										{address?.pincode}
									</Typography>
									<Typography color="textSecondary">{address?.city}</Typography>
								</Box>
							))}
						</Collapse>
					</Box>
					{contactDetails?.addresses?.length > 1 && (
						<Box style={{ marginLeft: "auto" }} p={3} pb={0}>
							<IconButton
								size="small"
								onClick={() => setContactAddressExpanded(!contactAddressExpanded)}
							>
								{contactAddressExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
							</IconButton>
						</Box>
					)}
				</Grid>
			</Grid>
		</Paper>
	);
}

export default ContactCard;
