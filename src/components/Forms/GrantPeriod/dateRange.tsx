import TextField from "@material-ui/core/TextField";
import { DateRangeDelimiter, DateRangePicker } from "@material-ui/pickers";
import React from "react";

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
	const [selectedDate, handleDateChange] = React.useState<[Date | null, Date | null]>([
		from.preFilledValue || null,
		to.preFilledValue || null,
	]);

	React.useEffect(() => {
		onChange(selectedDate[0], selectedDate[1]);
	}, [selectedDate]);

	return (
		<DateRangePicker
			disableCloseOnSelect={true}
			startText={from.text}
			endText={to.text}
			value={selectedDate as [Date, Date]}
			onChange={(date) => handleDateChange([date[0], date[1]])}
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
