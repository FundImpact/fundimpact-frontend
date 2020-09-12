import { RenderResult } from "@testing-library/react";
import { IInputField, ISelectField } from "../models/index";

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
		let fieldName = (await reactElement.findByTestId(inputElement.testId)) as HTMLInputElement;
		await act(async () => {
			await fireEvent.change(fieldName, { target: { value } });
		});
		await expect(fieldName.value).toBe(value);
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
		await act(async () => {
			let saveButton = await reactElement.getByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
		});
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
			await act(async () => {
				let saveButton = await reactElement.getByTestId("createSaveButton");
				expect(saveButton).not.toBeEnabled();
			});
		} else {
			await act(async () => {
				let saveButton = await reactElement.getByTestId("createSaveButton");
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
		await act(async () => {
			let saveButton = await reactElement.getByTestId("createSaveButton");
			fireEvent.click(saveButton);
			await wait();
		});
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	return {
		checkElementHaveCorrectValue,
		checkSubmitButtonIsEnabled,
		requiredFieldTestForInputElement,
		triggerMutation,
	};
};
