import React from "react";
import ImpactCategoryDialog from "../ImpactCategoryDialog";
import { fireEvent, wait } from "@testing-library/react";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import { renderApollo } from "../../../../utils/test.util";
import { CREATE_IMPACT_CATEGORY_ORG_INPUT } from "../../../../graphql/Impact/mutation";
import { impactCategoeyDialogFields } from "../../../../utils/inputTestFields.json";
import { organizationDetail } from "../../../../utils/testMock.json";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../../graphql/Impact/query";
import { FORM_ACTIONS } from "../../../../models/constants";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const initialValues: any = {
	name: "impc name",
	description: "desc",
	code: "impc code ",
	shortname: "sh name",
};

const categoryMock = [
	{ id: 1, name: "Category" },
	{ id: 2, name: "Supply" },
];

const mocks = [
	{
		request: {
			query: CREATE_IMPACT_CATEGORY_ORG_INPUT,
			variables: {
				input: { ...initialValues, organization: "13" },
			},
		},
		result: () => {
			creationOccured = true;
			return {};
		},
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_BY_ORG,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { impactCategoryOrgList: categoryMock } },
	},
];

let consoleWarnSpy: undefined | jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

afterAll(() => {
	consoleWarnSpy?.mockRestore();
});

beforeAll(() => {
	consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation((msg) => {
		!msg.includes(
			"isInitialValid has been deprecated and will be removed in future versions of Formik."
		) && console.warn(msg);
	});
});

beforeEach(async () => {
	dialog = renderApollo(
		<DashboardProvider defaultState={{ organization: organizationDetail }}>
			<NotificationProvider>
				<ImpactCategoryDialog
					formAction={FORM_ACTIONS.CREATE}
					open={true}
					handleClose={handleClose}
					organization="13"
				/>
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
			resolvers: {},
		}
	);
	await wait();
});

const inputIds = impactCategoeyDialogFields;

describe("Imact category dialog tests", () => {
	test("Mock response", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = dialog.getByTestId(inputIds[i].id) as HTMLInputElement;
			let value = initialValues[inputIds[i].key];
			fireEvent.change(fieldName, { target: { value } });
			await wait(() => {
				expect(fieldName.value).toBe(value);
			});
		}
		let saveButton = dialog.getByTestId("createSaveButton");
		await wait(() => {
			expect(saveButton).toBeEnabled();
		});
		fireEvent.click(saveButton);
		await wait(() => {
			expect(creationOccured).toBe(true);
		});
	});
});
