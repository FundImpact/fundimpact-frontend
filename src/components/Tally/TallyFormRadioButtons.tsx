import React from "react";
import { Box, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

interface IRadioButton {
	name: string;
	label: string;
}

interface IRadioGroupForm {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: string;
	radios: IRadioButton[];
}

const TallyFormRadioButtons = ({ onChange, value, radios }: IRadioGroupForm) => {
	return (
		<RadioGroup
			aria-label="tally"
			name="row-radio-buttons-group"
			onChange={onChange}
			value={value}
		>
			<Box display="flex" justifyContent="space-between">
				{radios.map((radio) => (
					<FormControlLabel value={radio.name} control={<Radio />} label={radio.label} />
				))}
			</Box>
		</RadioGroup>
	);
};

export default TallyFormRadioButtons;
