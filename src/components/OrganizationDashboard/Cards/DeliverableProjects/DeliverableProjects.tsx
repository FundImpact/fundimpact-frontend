import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import CommonProgres from "../CommonProgress";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ProgressDialog from "../ProgressDialog";

const deliverableProjects = [
	{ name: "HUL Food Drive 2020", completed: 95, lastUpdated: "12-02-2020" },
	{ name: "Literacy Campaign Aug", completed: 85, lastUpdated: "12-02-2020" },
	{ name: "Deliverable Project", completed: 75, lastUpdated: "12-02-2020" },
	{ name: "project 4", completed: 65, lastUpdated: "12-02-2020" },
	{ name: "project 5", completed: 55, lastUpdated: "12-02-2020" },
];

export default function DeliverableProjectsCard() {
	const [deliverableProgressDialogOpen, setDeliverableProgressDialogOpen] = React.useState(false);

	return (
		<Grid container>
			<Grid item md={8}>
				<Box mt={1}>
					<Typography color="primary" gutterBottom>
						<FormattedMessage
							id="deliverableAchievedCardTitle"
							defaultMessage="Deliverable Achieved"
							description="This text will be show on dashboard for deliverable achieved card title"
						/>
					</Typography>
				</Box>
			</Grid>
			<Grid item md={4}>
				<Typography variant="caption">
					{" "}
					<FormattedMessage
						id="moreHeadingCards"
						defaultMessage="more"
						description="This text will be show on cards for more heading"
					/>
				</Typography>
				<IconButton onClick={() => setDeliverableProgressDialogOpen(true)}>
					<ArrowRightAltIcon fontSize="small" />
				</IconButton>
			</Grid>
			<Grid item md={12}>
				{deliverableProjects &&
					deliverableProjects.slice(0, 3).map((deliverableProject, index) => {
						return (
							<CommonProgres
								title={deliverableProject.name}
								date={deliverableProject.lastUpdated}
								percentage={deliverableProject.completed}
							/>
						);
					})}
			</Grid>
			{deliverableProgressDialogOpen && (
				<ProgressDialog
					open={deliverableProgressDialogOpen}
					onClose={() => setDeliverableProgressDialogOpen(false)}
					title={"Deliverable Projects"}
				>
					{deliverableProjects &&
						deliverableProjects.map((deliverableProject, index) => {
							return (
								<CommonProgres
									title={deliverableProject.name}
									date={deliverableProject.lastUpdated}
									percentage={deliverableProject.completed}
								/>
							);
						})}
				</ProgressDialog>
			)}
		</Grid>
	);
}
