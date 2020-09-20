import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import CommonProgres from "../CommonProgress";
import ProgressDialog from "../ProgressDialog";
import MoreButton from "../MoreIconButton";

const deliverableProjects = [
	{ name: "HUL Food Drive 2020", completed: 95, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Literacy Campaign Aug", completed: 85, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Deliverable Project", completed: 75, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 4", completed: 65, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 5", completed: 55, lastUpdated: "2017-12-03T10:15:30.000Z" },
];

export default function DeliverableProjectsCard() {
	const [deliverableProgressDialogOpen, setDeliverableProgressDialogOpen] = React.useState(false);

	return (
		<Grid container>
			<Grid item md={12}>
				<Box m={1} mb={2}>
					<Typography color="primary" gutterBottom>
						<FormattedMessage
							id="deliverableAchievedCardTitle"
							defaultMessage="Deliverable Achieved"
							description="This text will be show on dashboard for deliverable achieved card title"
						/>
					</Typography>
				</Box>
			</Grid>
			<Grid item md={12}>
				{deliverableProjects &&
					deliverableProjects.slice(0, 3).map((deliverableProject, index) => {
						return (
							<CommonProgres
								title={deliverableProject.name}
								date={deliverableProject.lastUpdated}
								percentage={deliverableProject.completed}
								size="md"
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
								<Box m={2}>
									<CommonProgres
										title={deliverableProject.name}
										date={deliverableProject.lastUpdated}
										percentage={deliverableProject.completed}
										size="lg"
									/>
								</Box>
							);
						})}
				</ProgressDialog>
			)}
			<Grid item md={9}></Grid>
			<Grid item md={3}>
				<MoreButton handleClick={() => setDeliverableProgressDialogOpen(true)} />
			</Grid>
		</Grid>
	);
}
