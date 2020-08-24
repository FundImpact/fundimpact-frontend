import React from "react";
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	makeStyles,
	createStyles,
} from "@material-ui/core";
import { IInputFields } from "../../models";

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

const InputFields = ({
	inputType,
	name,
	formik,
	label,
	testId,
	dataTestId,
	id,
	multiline = false,
	rows = 1,
	type = "text",
	optionsArray,
	inputLabelId,
	selectLabelId,
	selectId,
	getInputValue,
}: IInputFields) => {
	const classes = useStyles();
	if (inputType === "select") {
		return (
			<FormControl variant="outlined" className={classes.formControl}>
				<InputLabel id={inputLabelId}>{label}</InputLabel>

				<Select
					labelId={selectLabelId}
					id={selectId}
					error={!!formik.errors[name] && !!formik.touched[name]}
					value={formik.values[name]}
					onChange={
						getInputValue
							? (event) => {
									getInputValue(event.target.value);
									formik.handleChange(event);
							  }
							: formik.handleChange
					}
					onBlur={formik.handleBlur}
					label={label}
					name={name}
					data-testid={dataTestId}
					inputProps={{
						"data-testid": testId,
					}}
				>
					{optionsArray && !optionsArray.length && (
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
					)}
					{optionsArray &&
						optionsArray.map((elem: any, index: number) => (
							<MenuItem key={index} value={elem.id}>
								{elem.name}
							</MenuItem>
						))}
				</Select>
				<FormHelperText error>{formik.touched[name] && formik.errors[name]}</FormHelperText>
			</FormControl>
		);
	}
	return (
		<TextField
			style={{ width: "100%" }}
			value={formik.values[name]}
			error={!!formik.errors[name] && !!formik.touched[name]}
			helperText={formik.touched[name] && formik.errors[name]}
			onBlur={formik.handleBlur}
			onChange={
				getInputValue
					? (event) => {
							getInputValue(event.target.value);
							formik.handleChange(event);
					  }
					: formik.handleChange
			}
			label={label}
			data-testid={dataTestId}
			inputProps={{
				"data-testid": testId,
			}}
			required
			fullWidth
			name={`${name}`}
			variant="outlined"
			id={id}
			multiline={multiline}
			rows={rows}
			type={type}
		/>
	);
};

export default InputFields;
