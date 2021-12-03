import { Box, Grid, TextField } from "@material-ui/core";
import { DateRangeDelimiter } from "@material-ui/pickers";
// import { DateRange } from "@material-ui/pickers/DateRangePicker/RangeTypes";
import React from "react";
import { getTodaysDate } from "../../../utils";

export interface IDateStart {
	text: string;
	preFilledValue?: Date;
}

export function ICustomDatePicker({
	from,
	to,
	onChange,
}: {
	from: Date;
	to: Date;
	onChange: (from: Date | null, to: Date | null) => void;
}) {
	const [fromDateSelected, setfromDateSelected] = React.useState<Date>(from || new Date());
	const [toDateSelected, settoDateSelected] = React.useState<Date>(to || new Date());

	React.useMemo(() => {
		// if (fromDateSelected <= toDateSelected) {
		onChange(fromDateSelected, toDateSelected);
		// }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fromDateSelected, toDateSelected]);

	// const handleDateChange = (dateRange: DateRange<Date | null>) => {
	// 	setfromDateSelected(dateRange[0]);
	// 	settoDateSelected(dateRange[1]);
	// };

	return (
		<Grid item container xs={12} md={12}>
			<Grid item container xs={5} md={5}>
				<TextField
					id="date"
					label="Start Date"
					type="date"
					fullWidth
					required
					value={getTodaysDate(fromDateSelected)}
					onChange={(e) => setfromDateSelected(new Date(e.target.value))}
					variant="outlined"
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Grid>
			<Grid item container xs={2} md={2}>
				<Box mt={2} ml={2}>
					<DateRangeDelimiter> to </DateRangeDelimiter>
				</Box>
			</Grid>
			<Grid item container xs={5} md={5}>
				<TextField
					id="date"
					label="End Date"
					type="date"
					fullWidth
					required
					variant="outlined"
					value={getTodaysDate(toDateSelected)}
					onChange={(e) => settoDateSelected(new Date(e.target.value))}
					InputLabelProps={{
						shrink: true,
					}}
				/>
			</Grid>
		</Grid>
	);
}
