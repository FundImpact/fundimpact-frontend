import React from "react";
import { fireEvent, wait, RenderResult } from "@testing-library/react";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { renderApollo } from "../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetails, mockProjects } from "../../../utils/testMock.json";
import { individualFormFields } from "../inputField.json";
import { commonFormTestUtil } from "../../../utils/commonFormTest.util";
import { FORM_ACTIONS } from "../../../models/constants";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { IIndividualForm } from "../../../models/individual";
import IndividualDialog from "..";
import { CREATE_INDIVIDUAL } from "../../../graphql/Individual/mutation";
import { GET_PROJECTS } from "../../../graphql";

let consoleWarnSpy: undefined | jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

beforeAll(() => {
	consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation((msg) => {
		!msg.includes(
			"isInitialValid has been deprecated and will be removed in future versions of Formik."
		) && console.warn(msg);
	});
});

afterAll(() => {
	consoleWarnSpy?.mockRestore();
});

const handleClose = jest.fn();

let contactForm: RenderResult;
let creationOccured = false;

const intialFormValue: IIndividualForm = {
	name: "sherlock",
	project: [],
};

let orgDetails = organizationDetails;

const mocks = [
	{
		request: {
			query: GET_USER_ROLES,
			variables: {
				filter: {
					role: "1",
				},
			},
		},
		result: { data: mockUserRoles },
	},
	{
		request: {
			query: GET_PROJECTS,
			variables: {},
		},
		result: { data: mockProjects },
	},
	{
		request: {
			query: CREATE_INDIVIDUAL,
			variables: {
				input: {
					data: {
						name: intialFormValue.name,
						organization: orgDetails.id,
					},
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createT4DIndividual: {
						t4DIndividual: {
							id: "1",
							name: intialFormValue.name,
						},
					},
				},
			};
		},
	},
];

beforeEach(async () => {
	contactForm = renderApollo(
		<DashboardProvider defaultState={{ organization: orgDetails }}>
			<NotificationProvider>
				<IndividualDialog
					open={true}
					formAction={FORM_ACTIONS.CREATE}
					handleClose={handleClose}
				/>
			</NotificationProvider>
		</DashboardProvider>,
		{
			mocks,
			addTypename: false,
		}
	);
	await wait();
});

let inputIds = [individualFormFields[0]];

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Individual Dialog tests", () => {
	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled<IIndividualForm>({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: contactForm,
				value: intialFormValue[inputIds[i].name],
			});
		});
	}

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IIndividualForm>({
				inputFields: inputIds,
				reactElement: contactForm,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IIndividualForm>({
			inputFields: inputIds,
			reactElement: contactForm,
			intialFormValue,
		});
		await wait(() => {
			expect(creationOccured).toBe(true);
		});
	});
});
