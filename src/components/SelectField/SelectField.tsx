import React from "react";
import {
	FormControl,
	InputLabel,
	Select,
	FormHelperText,
	MenuItem,
	makeStyles,
	createStyles,
} from "@material-ui/core";
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
  selectId
}: ISelectField) => {
	const classes = useStyles();

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel id={inputLabelId}>
				{label}
			</InputLabel>

			<Select
				labelId={selectLabelId}
				id={selectId}
				error={
					!!formik.errors[name] && !!formik.touched[name]
				}
				value={formik.values[name]}
				onChange={formik.handleChange}
				onBlur={formik.handleBlur}
				label={label}
				name={name}
				data-testid={dataTestId}
				inputProps={{
					"data-testid": testId,
				}}
			>
				{optionsArray.map((elem: any, index: number) => (
					<MenuItem key={index} value={elem.id}>
						{elem.name}
					</MenuItem>
				))}
			</Select>
			<FormHelperText error>
				{formik.touched[name] && formik.errors[name]}
			</FormHelperText>
		</FormControl>
	);
};

export default SelectField;
