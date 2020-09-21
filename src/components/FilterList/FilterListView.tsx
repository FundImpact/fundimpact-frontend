import React from "react";
import Popover from "@material-ui/core/Popover";
import {
	Tooltip,
	IconButton,
	Typography,
	Box,
	Grid,
	makeStyles,
	Theme,
	createStyles,
	Button,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import InputFields from "../InputFields/inputField";
import { IInputFields } from "../../models";
import { Form, Formik } from "formik";

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

function FilterListView<T extends { [key: string]: string | string[] }>({
	inputFields,
	anchorEl,
	setAnchorEl,
	setFilterList,
	initialValues,
}: {
	inputFields: any[];
	anchorEl: HTMLButtonElement | null;
	setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
	setFilterList: React.Dispatch<React.SetStateAction<T>>;
	initialValues?: any;
}) {
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const classes = useStyles();

	const handleClose = () => {
		setAnchorEl(null);
	};

	const onSubmit = (values: T) => {
		setFilterList(values);
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	return (
		<>
			<Tooltip title="Filter list">
				<IconButton
					data-testid="filter-button"
					aria-label="filter list"
					onClick={handleClick}
				>
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
				data-testid="filter-list-popover"
			>
				<Box p={2}>
					<Typography variant="h5" gutterBottom>
						Filters
					</Typography>
					<Formik initialValues={initialValues} onSubmit={onSubmit}>
						{(formik) => {
							return (
								<Form>
									<Grid container spacing={2} direction="column">
										{inputFields.map((element: IInputFields, index: number) => (
											<Grid item xs={12} key={index}>
												<InputFields
													inputType={element.inputType}
													formik={formik}
													name={element.name}
													id={element.id}
													dataTestId={element.dataTestId}
													testId={element.testId}
													label={element.label}
													type={element.type ? element.type : "text"}
													optionsArray={
														element.optionsArray
															? element.optionsArray
															: []
													}
													inputLabelId={
														element.inputLabelId
															? element.inputLabelId
															: ""
													}
													selectLabelId={
														element.selectLabelId
															? element.selectLabelId
															: ""
													}
													selectId={
														element.selectId ? element.selectId : ""
													}
													required={element.required ? true : false}
													multiple={
														element.multiple ? element.multiple : false
													}
												/>
											</Grid>
										))}
									</Grid>
									<Box mt={2}>
										<Button
											className={classes.button}
											disableRipple
											variant="contained"
											color="secondary"
											type="submit"
											data-testid="createSaveButton"
										>
											Filter
										</Button>
										<Button
											className={classes.cancelButton}
											onClick={handleClose}
										>
											Cancel
										</Button>
									</Box>
								</Form>
							);
						}}
					</Formik>
				</Box>
			</Popover>
		</>
	);
}

export default FilterListView;
