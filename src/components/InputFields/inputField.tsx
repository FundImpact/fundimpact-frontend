import {
	Button,
	Checkbox,
	createStyles,
	FormControl,
	FormHelperText,
	InputLabel,
	ListItemText,
	makeStyles,
	MenuItem,
	Select,
	TextField,
	FormControlLabel,
	Switch,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { IInputFields } from "../../models";
import UploadFile from "../UploadFile";
import { Autocomplete } from "@material-ui/lab";

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
	required = false,
	multiple = false,
	logo,
	disabled,
	onClick,
	autoCompleteGroupBy,
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

	useEffect(() => {
		if (inputType == "multiSelect") {
			setElemName((formik.values[name]?.map((elem: any) => elem.id) as string[]) || []);
		}
	}, [formik, setElemName, name, inputType]);

	const elemHandleChange = (event: React.ChangeEvent<{ value: any }>) => {
		setElemName(event.target.value.map((elem: any) => elem.id) as string[]);
	};
	let renderValue;
	if (multiple) {
		renderValue = (selected: any) => (
			<div className={classes.chips}>
				{(selected as string[])
					.filter((selectedValue) => selectedValue)
					.map((value, index) => optionsArrayHash[value])
					.join(", ")}
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
					disabled={disabled}
				>
					{!optionsArray?.length && (
						<MenuItem value="">
							<em>No (context) available</em>
						</MenuItem>
					)}
					{multiSelect &&
						optionsArray &&
						optionsArray.map((elem: any, index: number) => (
							<MenuItem
								key={index}
								value={multiSelect ? elem : elem.id}
								disabled={elem.disabled}
							>
								{multiSelect ? (
									<Checkbox
										color="primary"
										checked={elemName.indexOf(elem.id) > -1}
										disabled={elem.disabled}
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
						optionsArray?.map(
							(
								elem: { id: string; name: string; disabled?: boolean },
								index: number
							) => (
								<MenuItem key={index} value={elem.id} disabled={elem.disabled}>
									<Checkbox
										color="primary"
										checked={formik.values[name].indexOf(elem.id) > -1}
										disabled={elem.disabled}
									/>
									<ListItemText primary={elem.name} />
								</MenuItem>
							)
						)}
				</Select>
				<FormHelperText error>{formik.touched[name] && formik.errors[name]}</FormHelperText>
			</FormControl>
		);
	}
	if (inputType == "autocomplete") {
		return (
			<Autocomplete
				multiple={multiple}
				options={
					optionsArray as {
						id: string;
						name: string;
					}[]
				}
				disableCloseOnSelect
				{...(autoCompleteGroupBy ? { groupBy: autoCompleteGroupBy } : {})}
				getOptionLabel={(option: { id: string; name: string }) => option.name}
				renderOption={(option, { selected }) => (
					<React.Fragment>
						{multiple && <Checkbox color="primary" checked={selected} />}
						{option.name}
					</React.Fragment>
				)}
				onChange={(e, value) => {
					formik.setFieldValue(name, value);
				}}
				// onBlur={() => formik.setFieldTouched(name, true)}
				fullWidth
				// value={formik.values[name]}
				defaultValue={formik.values[name]}
				getOptionSelected={(option, value) => option.id === value.id}
				id={id}
				renderInput={(params) => {
					return (
						<TextField
							{...params}
							// required={required}
							variant="outlined"
							label={label}
							error={!!formik.errors[name] && !!formik.touched[name]}
							helperText={formik.touched[name] && formik.errors[name]}
							data-testid={dataTestId}
							name={name}
							placeholder={label}
						/>
					);
				}}
			/>
		);
	}

	if (inputType == "switch") {
		return (
			<FormControlLabel
				control={
					<Switch
						checked={formik.values[name]}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						name={name}
					/>
				}
				label={label}
				data-testid={dataTestId}
			/>
		);
	}

	if (inputType === "upload") {
		return (
			<UploadFile
				formik={formik}
				title={label}
				height="120px"
				name={name}
				required={required}
				testId={testId}
				dataTestId={dataTestId}
				id={name}
				logo={logo}
			/>
		);
	}
	if (inputType === "button") {
		return (
			<Button
				className={classes.button}
				disableRipple
				variant="contained"
				color="primary"
				data-testid={`commonFormButton${label}`}
				disabled={disabled}
				onClick={onClick ? onClick : () => {}}
			>
				{label}
			</Button>
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
			disabled={disabled}
		/>
	);
};

export default InputFields;
