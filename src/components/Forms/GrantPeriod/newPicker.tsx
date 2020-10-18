/* eslint-disable no-console */
// @ts-nocheck
import TextField from "@material-ui/core/TextField";
import { DatePickerProps } from "@material-ui/pickers";
import { FieldProps } from "formik";
import * as React from "react";

interface DatePickerFieldProps extends FieldProps, DatePickerProps {
	getShouldDisableDateError: (date: Date) => string;
}

export function DatePickerField({
	form,
	field: { value, name },
	maxDate = new Date("2099-12-31"),
	minDate = new Date("1900-01-01"),
	getShouldDisableDateError,
	...other
}: DatePickerFieldProps) {
	const currentError = form.errors[name];
	const toShowError = Boolean(currentError && form.touched[name]);

	return (
		<DateRangePicker
			disableCloseOnSelect={true}
			startText={from.text}
			endText={to.text}
			value={[fromDateSelected, toDateSelected]}
			inputFormat="dd/MM/yyyy"
			onChange={handleDateChange}
			renderInput={(startProps, endProps) => (
				<>
					<TextField {...startProps} />
					<DateRangeDelimiter> to </DateRangeDelimiter>
					<TextField {...endProps} />
				</>
			)}
		/>
	);
}
