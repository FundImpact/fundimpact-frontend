import {
	createStyles,
	FormControl,
	FormHelperText,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
} from "@material-ui/core";
import React from "react";

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
					<MenuItem>
						<em>No {displayName} available</em>
					</MenuItem>
				) : null}

				{optionsArray?.map((elem: any, index: number) => (
					<MenuItem key={index} value={elem.id}>
						{elem.name}
					</MenuItem>
				))}
			</Select>
			<FormHelperText error>{formik.touched[name] && formik.errors[name]}</FormHelperText>
		</FormControl>
	);
};

export default SelectField;
