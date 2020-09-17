import { Box, Button, Grid, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import CommonProgres from "../CommonProgress";

const donors = [
	{ name: "Donor", completed: 60, lastUpdated: "12-02-2020" },
	{ name: "Donor", completed: 50, lastUpdated: "12-02-2020" },
	{ name: "Donor", completed: 40, lastUpdated: "12-02-2020" },
	{ name: "Donor", completed: 30, lastUpdated: "12-02-2020" },
	{ name: "Donor", completed: 20, lastUpdated: "12-02-2020" },
];

export default function DonorsCard() {
	const [donorsCardFilter, setDonorsCardFilter] = useState<{
		received: boolean;
		allocated: boolean;
	}>({
		received: true,
		allocated: false,
	});
	return (
		<Box>
			<Grid container>
				<Grid item md={7}>
					<Box display="flex">
						<Box>
							<Button
								color={donorsCardFilter.received ? "primary" : "default"}
								size="small"
								onClick={() =>
									setDonorsCardFilter({
										received: true,
										allocated: false,
									})
								}
							>
								<FormattedMessage
									id="receivedButtonCards"
									defaultMessage="Received"
									description="This text will be show on cards for received button"
								/>
							</Button>
						</Box>
						<Box>
							<Button
								color={donorsCardFilter.allocated ? "primary" : "default"}
								size="small"
								onClick={() =>
									setDonorsCardFilter({
										received: false,
										allocated: true,
									})
								}
							>
								<FormattedMessage
									id="allocatedButtonCards"
									defaultMessage="Allocated"
									description="This text will be show on cards for allocated button"
								/>
							</Button>
						</Box>
					</Box>
				</Grid>
				<Grid item md={2}>
					{/* <Button color={"primary"} size="small">
						See All
					</Button> */}
				</Grid>
				<Grid item md={3}>
					<Box ml={2}>
						<Typography variant="button">
							<FormattedMessage
								id="Top3HeadingCards"
								defaultMessage="Top 3"
								description="This text will be show on cards for top 3 heading"
							/>
						</Typography>
					</Box>
				</Grid>
			</Grid>
			<Box mt={1}>
				{donors &&
					donors.slice(0, 3).map((donor) => {
						return (
							<CommonProgres
								title={donor.name}
								date={donor.lastUpdated}
								percentage={donor.completed}
							/>
						);
					})}
			</Box>
		</Box>
	);
}
