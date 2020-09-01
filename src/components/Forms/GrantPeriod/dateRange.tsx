import TextField from "@material-ui/core/TextField";
import { DateRange, DateRangeDelimiter, DateRangePicker } from "@material-ui/pickers";
import React, { useState } from "react";

export interface IDateStart {
	text: string;
	preFilledValue?: Date;
}

export default function BasicDateRangePicker({
	from,
	to,
	onChange,
}: {
	from: IDateStart;
	to: IDateStart;
	onChange: (from: Date | null, to: Date | null) => void;
}) {
	const [selectedDate, handleDateChange] = React.useState<DateRange<Date>>([
		from.preFilledValue || null,
		to.preFilledValue || null,
	]);

	React.useEffect(() => {
		onChange(selectedDate[0], selectedDate[1]);
	}, [selectedDate]);
	const [open, setOpen] = React.useState(false);

	return (
		<DateRangePicker
			onOpen={() => setOpen(true)}
			disableCloseOnSelect={true}
			startText={from.text}
			endText={to.text}
			value={selectedDate as [Date, Date]}
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
