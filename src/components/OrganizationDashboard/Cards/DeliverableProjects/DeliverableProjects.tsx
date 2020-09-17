import { Box, Button, Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import CommonProgres from "../CommonProgress";

const deliverableProjects = [
	{ name: "project 1", completed: 95, lastUpdated: "12-02-2020" },
	{ name: "project 2", completed: 85, lastUpdated: "12-02-2020" },
	{ name: "project 3", completed: 75, lastUpdated: "12-02-2020" },
	{ name: "project 4", completed: 65, lastUpdated: "12-02-2020" },
	{ name: "project 5", completed: 55, lastUpdated: "12-02-2020" },
];

export default function DeliverableProjectsCard() {
	return (
		<Box>
			<Box justifyContent="flex-end" display="flex" ml={2}>
				<Box mr={2}>
					<Button color={"primary"} size="small">
						See All
					</Button>
				</Box>
				<Box mr={1}>
					<Typography variant="button">
						{" "}
						<FormattedMessage
							id="Top3HeadingCards"
							defaultMessage="Top 3"
							description="This text will be show on cards for top 3 heading"
						/>
					</Typography>
				</Box>
			</Box>
			<Box mt={1}>
				{deliverableProjects &&
					deliverableProjects.slice(0, 3).map((budgetProject, index) => {
						return (
							<CommonProgres
								title={budgetProject.name}
								date={budgetProject.lastUpdated}
								percentage={budgetProject.completed}
							/>
						);
					})}
			</Box>
		</Box>
	);
}
