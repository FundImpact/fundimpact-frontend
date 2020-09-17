import { Box, Grid, IconButton, Menu, MenuItem, Typography, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import { PieChart } from "../../../Charts";
import { Link } from "react-router-dom";
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
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<Grid container>
			<Grid item md={6}>
				<Box mt={1}>
					<Typography color="primary" noWrap gutterBottom>
						Impact Category
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
							setImpactCategoryFilter({
								projects: true,
								achieved: false,
							});

							handleClose();
						}}
					>
						Projects
					</MenuItem>
					<MenuItem
						onClick={() => {
							setImpactCategoryFilter({
								projects: false,
								achieved: true,
							});
							handleClose();
						}}
					>
						Achieved
					</MenuItem>
				</Menu>
				<Typography variant="caption">More</Typography>
				<Link to="/settings/impact">
					<IconButton>
						<ArrowRightAltIcon fontSize="small" />
					</IconButton>
				</Link>
			</Grid>
			<Grid item md={12}>
				<PieChart data={impactlePieData} />
			</Grid>
		</Grid>
	);
}
