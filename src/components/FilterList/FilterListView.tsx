import React from "react";
import Popover from "@material-ui/core/Popover";
import {
	Tooltip,
	IconButton,
	Typography,
	Box,
	Grid,
	TextField,
	makeStyles,
	Theme,
	createStyles,
	Button,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			color: theme.palette.background.paper,
			marginRight: theme.spacing(2),
		},
		cancelButton: {
			marginRight: theme.spacing(2),
			padding: theme.spacing(1),
			"&:hover": {
				color: "#d32f2f !important",
			},
		},
	})
);

function FilterListView({ inputElements }: { inputElements: string[] }) {
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const classes = useStyles();

	const handleClose = () => {
		setAnchorEl(null);
	};
	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	console.log("inputElements :>> ", inputElements);
	return (
		<>
			<Tooltip title="Filter list">
				<IconButton aria-label="filter list" onClick={handleClick}>
					<FilterListIcon />
				</IconButton>
			</Tooltip>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				<Box p={2}>
					<Typography variant="h5" gutterBottom>
						Filters
					</Typography>
					<Grid container spacing={2}>
						{inputElements.map((element: string) => {
							return (
								<Grid item xs={6}>
									<TextField
										style={{ margin: "0px" }}
										// error={!!formik.errors.email && !!formik.touched.email}
										// helperText={formik.touched.email && formik.errors.email}
										// onChange={formik.handleChange}
										// onBlur={formik.handleBlur}
										label={element}
										required
										fullWidth
										name={element}
										variant="outlined"
										type={"email"}
										id="email"
										data-testid="email"
									/>
								</Grid>
							);
						})}
					</Grid>
					<Box mt={1}>
						<Button
							className={classes.button}
							disableRipple
							variant="contained"
							color="secondary"
							type="submit"
							data-testid="createSaveButton"
							// disabled={!formik.isValid}
						>
							Filter
						</Button>
						<Button className={classes.cancelButton} onClick={handleClose}>
							Cancel
						</Button>
					</Box>
				</Box>
			</Popover>
		</>
	);
}

export default FilterListView;
