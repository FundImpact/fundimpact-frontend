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
	Checkbox,
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
	required,
}: IInputFields) => {
	const classes = useStyles();
	const [elemName, setElemName] = React.useState<string[]>([]);

	const elemHandleChange = (event: React.ChangeEvent<{ value: any }>) => {
		setElemName(event.target.value.map((elem: any) => elem.name) as string[]);
	};

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

		return (
			<FormControl variant="outlined" className={classes.formControl}>
				<InputLabel id={inputLabelId}>{required ? label : label + " ( opt )"}</InputLabel>

				<Select
					labelId={selectLabelId}
					id={selectId}
					error={!!formik.errors[name] && !!formik.touched[name]}
					value={formik.values[name]}
					multiple={multiSelect}
					onChange={onChange}
					required={required}
					onBlur={formik.handleBlur}
					label={required ? label : label + " ( opt )"}
					name={name}
					renderValue={
						multiSelect
							? (selected: any) => {
									let arr: any = selected.map((elem: any) => elem.name);
									return arr.join(", ");
							  }
							: undefined
					}
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
			label={required ? label : label + " ( opt )"}
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
