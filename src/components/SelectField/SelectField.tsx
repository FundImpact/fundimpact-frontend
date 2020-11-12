import {
	createStyles,
	FormControl,
	FormHelperText,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	Box,
	Typography,
} from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { ISelectField } from "../../models";

const useStyles = makeStyles(() =>
	createStyles({
		button: {
			color: "white",
		},
		formControl: {
			width: "100%",
		},
	})
);

const SelectField = ({
	name,
	formik,
	label,
	testId,
	dataTestId,
	optionsArray,
	inputLabelId,
	selectLabelId,
	selectId,
	displayName = "data",
	required = false,
	addNew = false,
	addNewClick,
}: Omit<ISelectField, "size" | "type">) => {
	const classes = useStyles();
	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel id={inputLabelId} required={required}>
				{label}
			</InputLabel>

			<Select
				labelId={selectLabelId}
				id={selectId}
				error={!!formik.errors[name] && !!formik.touched[name]}
				value={formik.values[name]}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				label={label}
				name={name}
				data-testid={dataTestId}
				inputProps={{
					"data-testid": testId,
				}}
				required={required}
			>
				{!optionsArray?.length ? (
					<MenuItem disabled>
						<em>No {displayName} available</em>
					</MenuItem>
				) : null}

				{optionsArray?.map((elem: any, index: number) => (
					<MenuItem key={index} value={elem.id}>
						{elem.name}
					</MenuItem>
				))}
				{addNew && addNewClick && (
					<MenuItem onClick={addNewClick} value="">
						<Box display="flex">
							<AddCircleIcon />
							<Box ml={1}>
								<Typography>
									<FormattedMessage
										id="addNewSelectField"
										defaultMessage="Add new"
										description="This text will be displayed as select field for select Field"
									/>
								</Typography>
							</Box>
						</Box>
					</MenuItem>
				)}
			</Select>
			<FormHelperText error>{formik.touched[name] && formik.errors[name]}</FormHelperText>
		</FormControl>
	);
};

export default SelectField;
