import React from "react";
import ImpaceUnitDialog from "../ImpaceUnitDialog";
import { act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { CREATE_IMPACT_UNITS_ORG_INPUT } from "../../../../graphql/queries/Impact/mutation";

const handleClose = jest.fn();

let dialog: any;

const initialValues: any = {
	name: "impc name",
	description: "desc",
	code: "impc code",
	target_unit: "123",
	prefix_label: "pre label",
	suffix_label: "suf label",
};

let creationOccured = false;

const mocks = [
	{
		request: {
			query: CREATE_IMPACT_UNITS_ORG_INPUT,
			variables: {
				input: initialValues,
			},
		},
		newData: jest.fn(() => {
			return {
				data: {
					createImpactUnitsOrgInput: {
						name: "impc name",
						code: "impc code",
					},
				},
			};
		}),
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider>
				<NotificationProvider>
					<ImpaceUnitDialog open={true} handleClose={handleClose} />
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

const inputIds = [
	{ id: "createInpactUnitNameInput", key: "name" },
	{ id: "createImpactUnitPrefixLabelInput", key: "prefix_label" },
	{ id: "createImpactUnitSuffixLabelInput", key: "suffix_label" },
	{ id: "createImpactUnitCodeInput", key: "code" },
	{ id: "createImpactUnitTargetUnitInput", key: "target_unit" },
	{ id: "createImpactUnitDescriptionInput", key: "description" },
];

describe("Impact Unit dialog tests", () => {
	test("Dialog is rendered correctly", () => {
		const conponent = dialog.getByTestId("impact-unit-dialog");
		expect(conponent).toBeInTheDocument();
	});

	test("Dialog render header correctly", () => {
		const header = dialog.getByTestId("dialog-header");
		expect(header).toHaveTextContent("New Impact Unit");
	});

	test("mock data", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].id)) as HTMLInputElement;
			let value = initialValues[inputIds[i].key];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			await expect(fieldName.value).toBe(value);
		}

		await act(async () => {
			let saveButton = await dialog.findByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
		});
	});
});
