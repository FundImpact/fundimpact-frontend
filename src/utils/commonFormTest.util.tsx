import { RenderResult } from "@testing-library/react";
import { IInputField, ISelectField } from "../models/index";
import userEvent from "@testing-library/user-event";

export const commonFormTestUtil = (fireEvent: any, wait: any, act: any) => {
	const checkElementHaveCorrectValue = async ({
		inputElement,
		reactElement,
		value,
	}: {
		inputElement: IInputField | ISelectField;
		reactElement: RenderResult;
		value: string | number;
	}) => {
		let fieldName = reactElement.getByTestId(inputElement.testId) as HTMLInputElement;
		fireEvent.change(fieldName, { target: { value } });
		await wait(() => {
			expect(fieldName.value).toBe(value);
		});
	};

	const checkSubmitButtonIsEnabled = async <T extends { [key: string]: any }>({
		inputFields,
		reactElement,
		intialFormValue,
	}: {
		inputFields: (IInputField | ISelectField)[];
		reactElement: RenderResult;
		intialFormValue: T;
	}) => {
		for (let i = 0; i < inputFields.length; i++) {
			await checkElementHaveCorrectValue({
				inputElement: inputFields[i],
				reactElement,
				value: intialFormValue[inputFields[i].name],
			});
		}

		let saveButton = reactElement.getByTestId("createSaveButton");
		expect(saveButton).toBeEnabled();
	};

	const requiredFieldTestForInputElement = async <T extends { [key: string]: any }>({
		inputFields,
		reactElement,
		intialFormValue,
		inputElement,
	}: {
		inputFields: (IInputField | ISelectField)[];
		reactElement: RenderResult;
		intialFormValue: T;
		inputElement: IInputField | ISelectField;
	}) => {
		for (let j = 0; j < inputFields.length; j++) {
			if (inputElement.name == inputFields[j].name) {
				await checkElementHaveCorrectValue({
					inputElement,
					reactElement,
					value: "",
				});
				continue;
			}
			await checkElementHaveCorrectValue({
				inputElement: inputFields[j],
				reactElement,
				value: intialFormValue[inputFields[j].name],
			});
		}
		if (inputElement.required) {
			let saveButton = await reactElement.getByTestId("createSaveButton");
			await wait(async () => {
				expect(saveButton).not.toBeEnabled();
			});
		} else {
			let saveButton = await reactElement.getByTestId("createSaveButton");
			await wait(async () => {
				expect(saveButton).toBeEnabled();
			});
		}
	};

	const triggerMutation = async <T extends { [key: string]: any }>({
		inputFields,
		reactElement,
		intialFormValue,
	}: {
		inputFields: (IInputField | ISelectField)[];
		reactElement: RenderResult;
		intialFormValue: T;
	}) => {
		await checkSubmitButtonIsEnabled({
			inputFields,
			reactElement,
			intialFormValue,
		});
		let saveButton = reactElement.getByTestId("createSaveButton");
		fireEvent.click(saveButton);
	};

	return {
		checkElementHaveCorrectValue,
		checkSubmitButtonIsEnabled,
		requiredFieldTestForInputElement,
		triggerMutation,
	};
};
