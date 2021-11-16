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
	Box,
	Typography,
	ListSubheader,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { IInputFields } from "../../models";
import UploadFile from "../UploadFile";
import { Autocomplete } from "@material-ui/lab";
import { FormattedMessage } from "react-intl";

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
	optionsLabel,
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
	addNew = false,
	addNewClick,
	secondOptionsArray,
	secondOptionsLabel,
	customMenuOnClick,
	textNextToButton,
	helperText,
}: IInputFields) => {
	console.log("disabled: ", disabled);
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
		if (inputType === "multiSelect") {
			setElemName(
				formik.values[name]?.map((elem: any) => {
					if (elem) return elem.id;
				})
			);
		}
	}, [formik, setElemName, name, inputType]);

	const elemHandleChange = (event: React.ChangeEvent<{ value: any }>) => {
		setElemName(
			event.target.value.map((elem: any) => {
				if (elem) return elem.id;
			})
		);
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
				if (multiple && Array.isArray(event.target.value)) {
					event.target.value = (event.target.value as any[]).filter((elem) => elem);
				}
				if (getInputValue) {
					getInputValue(event.target.value);
					formik.handleChange(event);
				} else formik.handleChange(event);
			}
		};

		if (multiSelect) {
			renderValue = (selected: any) => {
				let arr: any = selected.map((elem: any) => elem?.name);
				return arr.filter((item: any) => !!item).join(", ");
			};
		}
		return (
			<>
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
						{optionsLabel && (
							<ListSubheader disableSticky={true}>{optionsLabel}</ListSubheader>
						)}
						{!optionsArray?.length && (
							<MenuItem value="">
								<em>
									<FormattedMessage
										id="noContextAvailable"
										defaultMessage="No (context) available"
										description="This text will be displayed as select field for no context available"
									/>
								</em>
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
							optionsArray?.map(
								(
									elem: {
										id: string;
										name: string;
										groupName?: string;
										target_value?: string;
									},
									index: number
								) =>
									elem.groupName ? (
										<ListSubheader>{elem.groupName}</ListSubheader>
									) : (
										<MenuItem key={index} value={elem.id}>
											{elem.name || elem.target_value}
										</MenuItem>
									)
							)}
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
						{secondOptionsLabel && (
							<ListSubheader disableSticky={true}>{secondOptionsLabel}</ListSubheader>
						)}
						{secondOptionsArray &&
							secondOptionsArray.map((element: any, index: number) => (
								<MenuItem
									key={index}
									value={multiSelect ? element : element.id}
									disabled={element.disabled}
									onClick={(e) =>
										customMenuOnClick ? customMenuOnClick(element) : null
									}
								>
									{multiSelect ? (
										<Checkbox
											color="primary"
											checked={elemName.indexOf(element.id) > -1}
											disabled={element.disabled}
										/>
									) : null}
									<Typography>{element.name}</Typography>
								</MenuItem>
							))}

						{addNew && addNewClick && (
							<MenuItem onClick={addNewClick} selected={false} value="">
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
					<FormHelperText error>
						{formik.touched[name] && formik.errors[name]}
					</FormHelperText>
				</FormControl>
				{helperText && <Typography variant="body1">{helperText}</Typography>}
			</>
		);
	}
	if (inputType === "autocomplete") {
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

	if (inputType === "switch") {
		return (
			<FormControlLabel
				control={
					<Switch
						checked={formik.values[name]}
						onChange={(event) => {
							if (getInputValue) {
								getInputValue(event.target.checked);
								formik.handleChange(event);
							} else formik.handleChange(event);
						}}
						disabled={disabled}
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
			<Box display="flex">
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
				{textNextToButton && (
					<Box m={1}>
						<Typography color="textSecondary">{textNextToButton}</Typography>
					</Box>
				)}
			</Box>
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
			{...(type === "date" ? { InputLabelProps: { shrink: true } } : {})}
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
