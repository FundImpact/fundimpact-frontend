import {
	Checkbox,
	Chip,
	createStyles,
	FormControl,
	FormHelperText,
	InputLabel,
	ListItemText,
	makeStyles,
	MenuItem,
	Select,
	TextField,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

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
	required,
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
	// const classes = useStyles();
	const [elemName, setElemName] = React.useState<string[]>([]);

	const elemHandleChange = (event: React.ChangeEvent<{ value: any }>) => {
		setElemName(event.target.value.map((elem: any) => elem.name) as string[]);
	};
	let renderValue;
	if (multiple) {
		renderValue = (selected: any) => (
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
		);
	}

	if (inputType === "select" || inputType === "multiSelect") {
		let multiSelect: boolean = inputType === "multiSelect" ? true : false;

		let onChange = (event: React.ChangeEvent<{ value: unknown }>) => {
			if (inputType === "multiSelect") {
				elemHandleChange(event);
				formik.handleChange(event);
			}
			if (inputType === "select") {
				if (getInputValue) {
					getInputValue(event.target.value);
					formik.handleChange(event);
				} else formik.handleChange(event);
			}
		};

		if (multiSelect) {
			renderValue = (selected: any) => {
				let arr: any = selected.map((elem: any) => elem.name);
				return arr.join(", ");
			};
		}
		return (
			<FormControl variant="outlined" className={classes.formControl}>
				<InputLabel required={required} id={inputLabelId}>
					{label}
				</InputLabel>

				<Select
					labelId={selectLabelId}
					id={selectId}
					error={!!formik.errors[name] && !!formik.touched[name]}
					value={formik.values[name]}
					multiple={multiSelect || multiple}
					onChange={onChange}
					required={required}
					onBlur={formik.handleBlur}
					label={label}
					name={name}
					renderValue={renderValue}
					data-testid={dataTestId}
					inputProps={{
						"data-testid": testId,
					}}
				>
					{multiSelect && !optionsArray?.length && (
						<MenuItem value="">
							<em>None</em>
						</MenuItem>
					)}
					{multiSelect &&
						optionsArray &&
						optionsArray.map((elem: any, index: number) => (
							<MenuItem key={index} value={multiSelect ? elem : elem.id}>
								{multiSelect ? (
									<Checkbox
										color="primary"
										checked={elemName.indexOf(elem.name) > -1}
									/>
								) : null}
								{elem.name}
							</MenuItem>
						))}
					{!multiple &&
						!multiSelect &&
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
			required={required}
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
