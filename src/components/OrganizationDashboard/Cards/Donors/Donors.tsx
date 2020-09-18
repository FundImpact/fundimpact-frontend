import { Box, Grid, IconButton, Menu, MenuItem, Typography } from "@material-ui/core";
import React, { useState } from "react";
import CommonProgres from "../CommonProgress";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import ProgressDialog from "../ProgressDialog";

const donors = [
	{ name: "A ONE Donor", completed: 60, lastUpdated: "2020-09-18T10:16:34.000Z" },
	{ name: "Chintu Gudia", completed: 50, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Donor", completed: 40, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Donor", completed: 30, lastUpdated: "2017-12-03T10:15:30.000Z" },
	{ name: "Donor", completed: 20, lastUpdated: "2017-12-03T10:15:30.000Z" },
];

export default function DonorsCard() {
	const [donorsCardFilter, setDonorsCardFilter] = useState<{
		received: boolean;
		allocated: boolean;
	}>({
		received: true,
		allocated: false,
	});
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const [donorsProgressDialogOpen, setonorsProgressDialogOpen] = React.useState(false);

	return (
		<Grid container>
			<Grid item md={6}>
				<Box mt={1}>
					<Typography color="primary" gutterBottom>
						{`Donors`}
					</Typography>
				</Box>
			</Grid>
			<Grid item md={6}>
				<IconButton onClick={handleClick}>
					<FilterListIcon fontSize="small" />
				</IconButton>
				<Menu
					id="simple-menu-budget-org"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => {
							setDonorsCardFilter({
								received: true,
								allocated: false,
							});
							handleClose();
						}}
					>
						Received
					</MenuItem>
					<MenuItem
						onClick={() => {
							setDonorsCardFilter({
								received: false,
								allocated: true,
							});

							handleClose();
						}}
					>
						Allocated
					</MenuItem>
				</Menu>
				<Typography variant="caption">More</Typography>
				<IconButton onClick={() => setonorsProgressDialogOpen(true)}>
					<ArrowRightAltIcon fontSize="small" />
				</IconButton>
			</Grid>
			<Grid item md={12}>
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
			</Grid>
			{donorsProgressDialogOpen && (
				<ProgressDialog
					open={donorsProgressDialogOpen}
					onClose={() => setonorsProgressDialogOpen(false)}
					title={"Donors"}
				>
					{donors &&
						donors.map((donor, index) => {
							return (
								<Box m={2}>
									<CommonProgres
										title={donor.name}
										date={donor.lastUpdated}
										percentage={donor.completed}
									/>
								</Box>
							);
						})}
				</ProgressDialog>
			)}
		</Grid>
	);
}
