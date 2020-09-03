import React from "react";
import { fireEvent, wait, RenderResult } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { IInputField, ISelectField } from "../models/index";

export const checkElementHaveCorrectValue = async ({
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

export const checkSubmitButtonIsEnabled = async <T,>({
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

export const requiredFieldTestForInputElement = async <T,>({
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

export const triggerMutation = async <T,>({
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
		let budgetTargetSaveButton = await reactElement.getByTestId("createSaveButton");
		fireEvent.click(budgetTargetSaveButton);
		await wait();
	});
	await new Promise((resolve) => setTimeout(resolve, 1000));
};
