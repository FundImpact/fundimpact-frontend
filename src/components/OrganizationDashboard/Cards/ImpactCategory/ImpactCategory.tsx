import { Box, Grid, IconButton, Menu, MenuItem, Typography, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import FilterListIcon from "@material-ui/icons/FilterList";
import { PieChart } from "../../../Charts";
import { FormattedMessage } from "react-intl";
import MoreButton from "../MoreIconButton";
export default function ImpactCategoryCard() {
	const theme = useTheme();
	const [impactCategoryFilter, setImpactCategoryFilter] = useState<{
		projects: boolean;
		achieved: boolean;
	}>({
		projects: true,
		achieved: false,
	});

	let impactlePieData = {
		datasets: [
			{
				backgroundColor: [
					theme.palette.primary.main,
					theme.palette.secondary.main,
					theme.palette.grey[200],
				],
				data: [5000, 3000, 1500],
			},
		],
	};
	let impactCategoryCardTitle = (
		<FormattedMessage
			id="impactCategoryCardTitle"
			defaultMessage="Impact Category"
			description="This text will be show on dashboard for impact category card title"
		/>
	);
	const impactCategoryCardMenuHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const impactCategoryCardMenuHandleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Grid container>
			<Grid item md={9}>
				<Box mt={1}>
					<Typography color="primary" noWrap gutterBottom>
						{impactCategoryCardTitle}
					</Typography>
				</Box>
			</Grid>
			<Grid item md={3}>
				<IconButton onClick={impactCategoryCardMenuHandleClick}>
					<FilterListIcon fontSize="small" />
				</IconButton>
				<Menu
					id="simple-menu-impact-category"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={impactCategoryCardMenuHandleClose}
				>
					<MenuItem
						onClick={() => {
							setImpactCategoryFilter({
								projects: true,
								achieved: false,
							});

							impactCategoryCardMenuHandleClose();
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
							setImpactCategoryFilter({
								projects: false,
								achieved: true,
							});
							impactCategoryCardMenuHandleClose();
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
					<PieChart data={impactlePieData} />
				</Box>
			</Grid>
			<Grid item md={8}></Grid>
			<Grid item md={4}>
				<MoreButton link={"/settings/impact"} />
			</Grid>
		</Grid>
	);
}
