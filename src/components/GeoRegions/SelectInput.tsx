import * as React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";

const places = ["country", "state", "district", "block", "grampanchayat", "village"];
let placesValue: any;
places.map((elem) => {
	placesValue = elem;
});

function InputControl() {
	return (
		<FormControl fullWidth>
			<InputLabel id="country-select-label">{placesValue}</InputLabel>
			<Select
				labelId="country-select-label"
				id="country-simple-select"
				// value={age}
				label={placesValue}
				// onChange={selectChange}
			>
				<MenuItem value={10}>Ten</MenuItem>
				<MenuItem value={20}>Twenty</MenuItem>
				<MenuItem value={30}>Thirty</MenuItem>
			</Select>
		</FormControl>
	);
}

export default InputControl;
