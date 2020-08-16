import React from "react";
import { TextField } from "@material-ui/core";
import { IInputField } from "../../models";

const InputField = ({
	name,
	formik,
	label,
	testId,
	dataTestId,
	id,
	multiline = false,
	rows = 1,
	type = "text",
}: IInputField) => {
	return (
		<TextField
			style={{ width: "100%" }}
			value={formik.values[name]}
			error={!!formik.errors[name] && !!formik.touched[name]}
			helperText={formik.touched[name] && formik.errors[name]}
			onChange={formik.handleChange}
			onBlur={formik.handleBlur}
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

export default InputField;
