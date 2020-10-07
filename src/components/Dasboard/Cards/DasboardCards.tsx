import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import { CARD_TYPES } from "./constants";
import { CardProps } from "../../../models/cards/cards";
import { GetCardTypeAndValues } from "./cardHooks/GetCardType";
import { ProjectCard, PieCard, ProgressCard } from "./CommonCards";

export default function DashboardCard(props: CardProps) {
	const { title, children, cardHeight = "180px", cardFilter } = props;
	const [currentFilter, setCurrentFilter] = useState<{ label: string; base: string }>();
	let { projectCardConfig, pieCardConfig, progressCardConfig } = GetCardTypeAndValues({
		...props,
		currentFilter,
	});

	const useStyles = makeStyles((theme: Theme) => ({
		root: {
			width: "100%",
			"& > * + *": {
				marginTop: theme.spacing(2),
			},
		},
		card: {
			margin: theme.spacing(1),
			marginTop: theme.spacing(0),
		},
	}));

	/*setting first filter as default filter*/
	useEffect(() => {
		if (cardFilter?.length) {
			setCurrentFilter(cardFilter[0]);
		}
	}, []);

	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	function renderCard() {
		switch (props.type) {
			case CARD_TYPES.PROGRESS:
				return <ProgressCard {...progressCardConfig} />;
			case CARD_TYPES.PIE:
				return <PieCard {...pieCardConfig} />;
			case CARD_TYPES.PROJECT:
				return <ProjectCard {...projectCardConfig} />;
		}
	}

	return (
		<Card raised={false} className={classes.card} style={{ height: cardHeight }}>
			<CardContent>
				<Grid container>
					<Grid item container justify="space-between">
						<Grid item xs={7}>
							{title && (
								<Box mt={1} mb={1} mr={1}>
									<Typography color="primary" gutterBottom noWrap>
										{title}
									</Typography>
								</Box>
							)}
						</Grid>
						<Grid item xs={3}>
							{cardFilter && cardFilter.length > 0 && (
								<Box mt={1} mb={1} color="text.disabled">
									<Typography variant="caption" gutterBottom noWrap>
										{currentFilter?.label}
									</Typography>
								</Box>
							)}
						</Grid>
						<Grid item xs={2}>
							{cardFilter && cardFilter.length > 0 && (
								<>
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
										{cardFilter.map(
											(
												filter: { label: string; base: string },
												mapIndex: number
											) => {
												return (
													<MenuItem
														key={mapIndex}
														onClick={() => {
															setCurrentFilter(filter);
															handleClose();
														}}
													>
														{filter.label}
													</MenuItem>
												);
											}
										)}
									</Menu>
								</>
							)}
						</Grid>
					</Grid>
					{renderCard()}
				</Grid>
				<Grid item md={12}>
					{children}
				</Grid>
			</CardContent>
		</Card>
	);
}
