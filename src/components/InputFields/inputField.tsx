import React, { useState, useEffect } from "react";
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	makeStyles,
	createStyles,
	Checkbox,
	ListItemText,
	Chip,
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
		chips: {
			display: "flex",
			flexWrap: "wrap",
		},
		chip: {
			margin: 2,
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
	multiple = false,
}: IInputFields) => {
	const classes = useStyles();
	const [optionsArrayHash, setOptionsArrayHash] = useState<{ [key: string]: string }>({});

	useEffect(() => {
		if (optionsArray?.length)
			setOptionsArrayHash(() => {
				return optionsArray?.reduce(
					(
						accumulator: { [key: string]: string },
						current: { id: string; name: string }
					) => {
						accumulator[current.id] = current.name;
						return accumulator;
					},
					{}
				);
			});
	}, [optionsArray]);

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
					multiple={multiple}
					renderValue={(selected) => {
						return multiple ? (
							<div className={classes.chips}>
								{(selected as string[])
									.filter((selectedValue) => selectedValue)
									.map((value, index) => (
										<Chip
											key={index}
											label={optionsArrayHash[value]}
											className={classes.chip}
										/>
									))}
							</div>
						) : (
							optionsArrayHash[selected as string]
						);
					}}
				>
					{!optionsArray?.length && (
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
					)}
					{!multiple &&
						optionsArray?.map((elem: { id: string; name: string }, index: number) => (
							<MenuItem key={index} value={elem.id}>
								{elem.name}
							</MenuItem>
						))}
					{multiple &&
						optionsArray?.map((elem: { id: string; name: string }, index: number) => (
							<MenuItem key={index} value={elem.id}>
								<Checkbox
									color="primary"
									checked={formik.values[name].indexOf(elem.id) > -1}
								/>
								<ListItemText primary={elem.name} />
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
