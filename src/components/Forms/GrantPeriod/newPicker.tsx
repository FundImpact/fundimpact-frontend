/* eslint-disable no-console */
// @ts-nocheck
import TextField from "@material-ui/core/TextField";
import { DatePicker, DatePickerProps } from "@material-ui/pickers";
import { format } from "date-fns";
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

	return (
		<DatePicker
			clearable
			minDate={minDate}
			maxDate={maxDate}
			value={value}
			onError={(reason, value) => {
				switch (reason) {
					case "invalidDate":
						form.setFieldError(name, "Invalid date format");
						break;

					case "disablePast":
						form.setFieldError(name, "Values in the past are not allowed");
						break;

					case "maxDate":
						form.setFieldError(
							name,
							`Date should not be after ${format(maxDate, "P")}`
						);
						break;

					case "minDate":
						form.setFieldError(
							name,
							`Date should not be before ${format(minDate, "P")}`
						);
						break;

					case "shouldDisableDate":
						// shouldDisableDate returned true, render custom message according to the `shouldDisableDate` logic
						form.setFieldError(name, getShouldDisableDateError(value));
						break;

					default:
						form.setErrors({
							...form.errors,
							[name]: undefined,
						});
				}
			}}
			// Make sure that your 3d param is set to `false` on order to not clear errors
			onChange={(date) => form.setFieldValue(name, date, false)}
			renderInput={(props) => (
				<TextField
					{...props}
					name={name}
					error={toShowError}
					helperText={toShowError ? currentError ?? props.helperText : undefined}
					// Make sure that your 3d param is set to `false` on order to not clear errors
					onBlur={() => form.setFieldTouched(name, true, false)}
				/>
			)}
			{...other}
		/>
	);
}
