import React, { useEffect, useState } from "react";
import {
	Box,
	Card,
	CardContent,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
	Typography,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import FilterListIcon from "@material-ui/icons/FilterList";
import { CARD_TYPES } from "./constants";
import { CardProps } from "../../../models/cards/cards";
import { GetCardTypeAndValues } from "./cardHooks/GetCardType";
import { ProjectCard, PieCard, ProgressCard } from "./CommonCards";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useIntl } from "react-intl";

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
	}, [cardFilter]);

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
	const intl = useIntl();

	let topLabel = intl.formatMessage({
		id: "topLabelCards",
		defaultMessage: "Top",
		description: "This text will be show on cards for top label",
	});

	let byLabel = intl.formatMessage({
		id: "byLabelCards",
		defaultMessage: "Filtered By",
		description: "This text will be show on cards for top label",
	});

	let filterLabel = intl.formatMessage({
		id: "filterLabelCard",
		defaultMessage: "Filter",
		description: "This text will be show on cards for Filter label",
	});

	let projectsLabel = intl.formatMessage({
		id: "projectsLableCard",
		defaultMessage: "Project's",
		description: "This text will be show on cards for Project's label",
	});

	return (
		<Card raised={false} className={classes.card} style={{ height: cardHeight }}>
			<CardContent>
				<Grid container>
					<Grid item container justify="space-between">
						<Grid item xs={8}>
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
								<>
									<Box mt={1}>
										<Tooltip title={filterLabel}>
											<IconButton onClick={handleClick} size="small">
												<FilterListIcon fontSize="small" />
											</IconButton>
										</Tooltip>
									</Box>

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
						<Grid item xs={1}>
							{title &&
								((cardFilter && cardFilter.length > 0) ||
									props.type === CARD_TYPES.PROGRESS ||
									props.type === CARD_TYPES.DEFAULT) && (
									<Box color="text.disabled" mt={1}>
										{/* <Typography variant="caption" gutterBottom noWrap>
										{currentFilter?.label}
									</Typography> */}
										<IconButton size="small">
											<Tooltip
												title={
													props.type === CARD_TYPES.PROGRESS
														? `${topLabel} ${title}`
														: props.type === CARD_TYPES.DEFAULT
														? `${projectsLabel} ${title.toLocaleLowerCase()}`
														: `${byLabel} ${currentFilter?.label}`
												}
											>
												<InfoOutlinedIcon fontSize="small" />
											</Tooltip>
										</IconButton>
									</Box>
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
