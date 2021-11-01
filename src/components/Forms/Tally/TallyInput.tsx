import React from "react";
import { Grid } from "@material-ui/core";
import InputFields from "../../InputFields/inputField";
import { IInputFields } from "../../../models";

const TallyInput = ({ value, formik }: { value: IInputFields; formik: any }) => {
	return (
		<Grid item xs={value.size}>
			<InputFields
				inputType={value.inputType}
				formik={formik}
				name={value.name}
				id={value.id}
				dataTestId={value.dataTestId}
				testId={value.testId}
				label={value.label}
				multiline={value.multiline ? value.multiline : false}
				rows={value.rows ? value.rows : 1}
				type={value.type ? value.type : "text"}
				optionsLabel={value.optionsLabel ? value.optionsLabel : undefined}
				optionsArray={value.optionsArray ? value.optionsArray : []}
				secondOptionsArray={value.secondOptionsArray ? value.secondOptionsArray : []}
				customMenuOnClick={value.customMenuOnClick ? value.customMenuOnClick : null}
				secondOptionsLabel={value.secondOptionsLabel ? value.secondOptionsLabel : undefined}
				inputLabelId={value.inputLabelId ? value.inputLabelId : ""}
				selectLabelId={value.selectLabelId ? value.selectLabelId : ""}
				selectId={value.selectId ? value.selectId : ""}
				getInputValue={value.getInputValue ? value.getInputValue : null}
				required={value.required ? true : false}
				multiple={value.multiple ? value.multiple : false}
				logo={value.logo ? value.logo : ""}
				disabled={value.disabled ? value.disabled : false}
				autoCompleteGroupBy={value.autoCompleteGroupBy || undefined}
				onClick={value.onClick ? value.onClick : null}
				textNextToButton={value.textNextToButton ? value.textNextToButton : undefined}
				addNew={value.addNew ? value.addNew : false}
				addNewClick={value.addNewClick ? value.addNewClick : null}
				helperText={value?.helperText || ""}
			/>
		</Grid>
	);
};

export default TallyInput;
