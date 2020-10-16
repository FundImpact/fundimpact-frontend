import { TextField } from "@material-ui/core";
import { DateRangeDelimiter, DateRangePicker } from "@material-ui/pickers";
import { DateRange } from "@material-ui/pickers/DateRangePicker/RangeTypes";
import React from "react";

export interface IDateStart {
	text: string;
	preFilledValue?: Date;
}

export function ICustomDatePicker({
	from,
	to,
	onChange,
}: {
	from: IDateStart;
	to: IDateStart;
	onChange: (from: Date | null, to: Date | null) => void;
}) {
	const [fromDateSelected, setfromDateSelected] = React.useState<Date | null>(
		from.preFilledValue || null
	);
	const [toDateSelected, settoDateSelected] = React.useState<Date | null>(
		to.preFilledValue || null
	);

	React.useEffect(() => {
		onChange(fromDateSelected, toDateSelected);
	}, [fromDateSelected, toDateSelected]);

	const handleDateChange = (dateRange: DateRange<Date | null>) => {
		setfromDateSelected(dateRange[0]);
		settoDateSelected(dateRange[1]);
	};

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
