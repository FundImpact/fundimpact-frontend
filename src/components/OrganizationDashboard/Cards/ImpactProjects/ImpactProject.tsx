import { Box, Grid, IconButton, Typography } from "@material-ui/core";
import React from "react";
import CommonProgres from "../CommonProgress";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ProgressDialog from "../ProgressDialog";
import MoreButton from "../MoreIconButton";

const impactProjects = [
	{ name: "Literacy Campaign Aug", completed: 95, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "HUL Food Drive 2020", completed: 85, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Impact Project", completed: 75, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 4", completed: 65, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "project 5", completed: 55, lastUpdated: "2017-12-03T10:15:30.000Z" },
];

export default function ImpactProjectsCard() {
	const [impactProgressDialogOpen, setImpactProgressDialogOpen] = React.useState(false);
	return (
		<Grid container>
			<Grid item md={12}>
				<Box m={1} mb={2}>
					<Typography color="primary" gutterBottom>
						Impact Achieved
					</Typography>
				</Box>
			</Grid>
			<Grid item md={12}>
				{impactProjects &&
					impactProjects.slice(0, 3).map((impactProject, index) => {
						return (
							<CommonProgres
								title={impactProject.name}
								date={impactProject.lastUpdated}
								percentage={impactProject.completed}
								size="md"
							/>
						);
					})}
			</Grid>
			{impactProgressDialogOpen && (
				<ProgressDialog
					open={impactProgressDialogOpen}
					onClose={() => setImpactProgressDialogOpen(false)}
					title={"Impact Projects"}
				>
					{impactProjects &&
						impactProjects.map((impactProject, index) => {
							return (
								<Box m={2}>
									<CommonProgres
										title={impactProject.name}
										date={impactProject.lastUpdated}
										percentage={impactProject.completed}
										size="lg"
									/>
								</Box>
							);
						})}
				</ProgressDialog>
			)}
			<Grid item md={9}></Grid>
			<Grid item md={3}>
				<MoreButton handleClick={() => setImpactProgressDialogOpen(true)} />
			</Grid>
		</Grid>
	);
}
