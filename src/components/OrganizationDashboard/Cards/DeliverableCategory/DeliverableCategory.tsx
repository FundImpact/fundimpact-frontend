import { Box, Grid, IconButton, Menu, MenuItem, Typography, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { PieChart } from "../../../Charts";
import { Link } from "react-router-dom";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

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
			<Grid item md={6}>
				<Box mt={1}>
					<Typography color="primary" noWrap gutterBottom>
						{cardTitle}
					</Typography>
				</Box>
			</Grid>
			<Grid item md={6}>
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
				<Typography variant="caption">
					{" "}
					<FormattedMessage
						id="moreHeadingCards"
						defaultMessage="more"
						description="This text will be show on cards for more heading"
					/>
				</Typography>
				<Link to="/settings/deliverable">
					<IconButton>
						<ArrowRightAltIcon fontSize="small" />
					</IconButton>
				</Link>
			</Grid>
			<Grid item md={12}>
				<PieChart data={DeliverablePieData} />
			</Grid>
		</Grid>
	);
}
