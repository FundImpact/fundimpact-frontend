import React from "react";
import {
	organizationDetails,
	projectDetails,
	projectDonorMock,
	mockFundReceiptProjectList,
	mockProjectDonors,
	mockCountryList,
} from "../../../utils/testMock.json";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { act } from "react-dom/test-utils";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { FORM_ACTIONS } from "../../../models/constants";
import { commonFormTestUtil } from "../../../utils/commonFormTest.util";
import { fireEvent, wait } from "@testing-library/dom";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { RenderResult } from "@testing-library/react";
import { fundReceivedForm } from "../inputFields.json";
import { getTodaysDate } from "../../../utils";
import { CREATE_FUND_RECEIPT } from "../../../graphql/FundRecevied/mutation";
import { IFundReceivedForm } from "../../../models/fundReceived/index.js";
import FundReceived from "../FundReceivedGraphql";
import { GET_PROJECT_DONORS, GET_COUNTRY_LIST } from "../../../graphql";
import {
	GET_FUND_RECEIPT_PROJECT_LIST,
	GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
} from "../../../graphql/FundRecevied";
import { GET_PROJ_DONORS } from "../../../graphql/project";

const handleClose = jest.fn();

let dialog: RenderResult;
let creationOccured = false;

const intialFormValue: IFundReceivedForm = {
	amount: "100",
	reporting_date: getTodaysDate(),
	project_donor: "18",
};

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
			query: GET_PROJECT_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projDonors: projectDonorMock,
			},
		},
	},
	{
		request: {
			query: GET_PROJ_DONORS,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projectDonors: projectDonorMock,
			},
		},
	},
	{
		request: {
			query: GET_COUNTRY_LIST,
		},
		result: {
			data: {
				countries: mockCountryList,
			},
		},
	},
	{
		request: {
			query: GET_FUND_RECEIPT_PROJECT_LIST_COUNT,
			variables: {
				filter: {
					project: projectDetails.id,
				},
			},
		},
		result: {
			data: {
				fundReceiptProjectListCount: 2,
			},
		},
	},
	{
		request: {
			query: GET_FUND_RECEIPT_PROJECT_LIST,
			variables: {
				filter: {
					project: projectDetails.id,
				},
				limit: 10,
				start: 0,
				sort: "created_at:DESC",
			},
		},
		result: {
			data: {
				fundReceiptProjectList: mockFundReceiptProjectList,
			},
		},
	},
	{
		request: {
			query: CREATE_FUND_RECEIPT,
			variables: {
				input: {
					amount: 100,
					reporting_date: getTodaysDate(),
					project_donor: "18",
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {
				data: {
					createFundReceiptProjectInput: {
						id: "1",
						amount: 100,
						reporting_date: getTodaysDate(),
						project_donor: {
							donor: {
								name: "ASGAR",
							},
						},
					},
				},
			};
		},
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectDetails, organization: organizationDetails }}
			>
				<NotificationProvider>
					<FundReceived
						formAction={FORM_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
					/>
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

const inputIds = [...fundReceivedForm];

const {
	checkElementHaveCorrectValue,
	checkSubmitButtonIsEnabled,
	requiredFieldTestForInputElement,
	triggerMutation,
} = commonFormTestUtil(fireEvent, wait, act);

describe("Fund Received Dialog tests", () => {
	test("Submit button enabled", async () => {
		await checkSubmitButtonIsEnabled<IFundReceivedForm>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
	});

	for (let i = 0; i < inputIds.length; i++) {
		test(`Required Field test for ${inputIds[i].name}`, async () => {
			await requiredFieldTestForInputElement<IFundReceivedForm>({
				inputFields: inputIds,
				reactElement: dialog,
				intialFormValue,
				inputElement: inputIds[i],
			});
		});
	}

	for (let i = 0; i < inputIds.length; i++) {
		test(`running test for ${inputIds[i].name} to check if the value is equal to value provided`, async () => {
			await checkElementHaveCorrectValue({
				inputElement: inputIds[i],
				reactElement: dialog,
				value: intialFormValue[inputIds[i].name as keyof IFundReceivedForm],
			});
		});
	}

	test("Mock response", async () => {
		await triggerMutation<IFundReceivedForm>({
			inputFields: inputIds,
			reactElement: dialog,
			intialFormValue,
		});
		expect(creationOccured).toBe(true);
	});
});
