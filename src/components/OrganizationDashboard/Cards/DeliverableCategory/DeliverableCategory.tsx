import { Box, Grid, IconButton, Menu, MenuItem, Typography, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { PieChart } from "../../../Charts";
import FilterListIcon from "@material-ui/icons/FilterList";
import MoreButton from "../MoreIconButton";

export default function DeliverableCategoryCard() {
	const theme = useTheme();
	const [deliverableCategoryFilter, setDeliverableCategory] = useState<{
		projects: boolean;
		achieved: boolean;
	}>({
		projects: true,
		achieved: false,
	});
	let cardTitle = (
		<FormattedMessage
			id="deliverableCategoryCardTitle"
			defaultMessage="Deliverable Category"
			description="This text will be show on dashboard for deliverable category card title"
		/>
	);
	let DeliverablePieData = {
		datasets: [
			{
				backgroundColor: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.grey[200],
				],
				data: [500, 200, 300],
			},
		],
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	return (
		<Grid container>
			<Grid item md={9}>
				<Box mt={1}>
					<Typography color="primary" noWrap gutterBottom>
						{cardTitle}
					</Typography>
				</Box>
			</Grid>
			<Grid item md={3}>
				<IconButton onClick={handleClick}>
					<FilterListIcon fontSize="small" />
				</IconButton>
				<Menu
					id="simple-menu-deliverable-category"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MenuItem
						onClick={() => {
							setDeliverableCategory({
								projects: true,
								achieved: false,
							});

							handleClose();
						}}
					>
						<FormattedMessage
							id="projectsButtonCards"
							defaultMessage="Projects"
							description="This text will be show on cards for project button"
						/>
					</MenuItem>
					<MenuItem
						onClick={() => {
							setDeliverableCategory({
								projects: false,
								achieved: true,
							});
							handleClose();
						}}
					>
						<FormattedMessage
							id="achievedButtonCards"
							defaultMessage="Achieved"
							description="This text will be show on cards for achieved button"
						/>
					</MenuItem>
				</Menu>
			</Grid>
			<Grid item md={12}>
				<Box p={1}>
					<PieChart data={DeliverablePieData} />
				</Box>
			</Grid>
			<Grid item md={8}></Grid>
			<Grid item md={4}>
				<MoreButton link={"/settings/deliverable"} />
			</Grid>
		</Grid>
	);
}
