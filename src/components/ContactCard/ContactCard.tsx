import {
	Box,
	Collapse,
	Divider,
	Grid,
	IconButton,
	Paper,
	Tooltip,
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
import { MODULE_CODES, userHasAccess } from "../../utils/access";
import { CONTACT_ACTION } from "../../utils/access/modules/contact/actions";

function TypographyContainer({
	title,
	color,
}: {
	title: string;
	color?:
		| "inherit"
		| "initial"
		| "primary"
		| "secondary"
		| "textPrimary"
		| "textSecondary"
		| "error";
}) {
	return (
		<Tooltip title={title} aria-label={title}>
			<Typography noWrap style={{ width: "150px" }} color={color}>
				{title}
			</Typography>
		</Tooltip>
	);
}

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
	const contactEditAccess = userHasAccess(MODULE_CODES.CONTACT, CONTACT_ACTION.UPDATE_CONTACT);

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
						<Tooltip title={contactDetails?.label} aria-label={contactDetails?.label}>
							<Typography
								variant="h5"
								style={{ color: "white", width: "250px" }}
								noWrap
							>
								{contactDetails?.label}
							</Typography>
						</Tooltip>
					</Box>
					{contactEditAccess && (
						<Box position="absolute" bottom="-10%" right="0" px={2}>
							<IconButton
								style={{ background: theme.palette.primary.main }}
								size="medium"
								onClick={() => setShowContactEditDialog(true)}
							>
								<EditIcon fontSize="small" style={{ color: "white" }} />
							</IconButton>
						</Box>
					)}
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
							<TypographyContainer title={contactDetails?.phone_numbers[0]?.value} />
							<TypographyContainer
								color="textSecondary"
								title={contactDetails?.phone_numbers[0]?.label}
							/>
						</Box>
						<Collapse in={contactPhoneExpanded} timeout="auto" unmountOnExit>
							{contactDetails?.phone_numbers?.slice(1)?.map((phone_number, idx) => (
								<Box p={1} key={idx}>
									<TypographyContainer title={phone_number?.value} />
									<TypographyContainer
										color="textSecondary"
										title={phone_number?.label}
									/>
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
							<TypographyContainer title={contactDetails?.emails[0]?.value} />
							<TypographyContainer
								title={contactDetails?.emails[0]?.label}
								color="textSecondary"
							/>
						</Box>
						<Collapse in={contactEmailExpanded} timeout="auto" unmountOnExit>
							{contactDetails?.emails?.slice(1)?.map((email, idx) => (
								<Box p={1} key={idx}>
									<TypographyContainer title={email?.value} />
									<TypographyContainer
										title={email?.label}
										color="textSecondary"
									/>
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
							<TypographyContainer
								title={contactDetails?.addresses[0]?.address_line_1}
							/>
							<TypographyContainer
								title={contactDetails?.addresses[0]?.address_line_2}
							/>
							<TypographyContainer
								title={contactDetails?.addresses[0]?.pincode}
								color="textSecondary"
							/>
							<TypographyContainer
								title={contactDetails?.addresses[0]?.city}
								color="textSecondary"
							/>
						</Box>
						<Collapse in={contactAddressExpanded} timeout="auto" unmountOnExit>
							{contactDetails?.addresses?.slice(1).map((address, idx) => (
								<Box p={2} pl={1} pb={1} key={idx}>
									<TypographyContainer title={address?.address_line_1} />
									<TypographyContainer title={address?.address_line_2} />
									<TypographyContainer
										title={address?.pincode}
										color="textSecondary"
									/>
									<TypographyContainer
										title={address?.city}
										color="textSecondary"
									/>
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
