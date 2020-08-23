import React from "react";
import CreateBudgetLineitemDialog from "../CreateBudgetLineitemDialog";
import { fireEvent, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DashboardProvider } from "../../../../contexts/dashboardContext";
import {
	CREATE_PROJECT_BUDGET_TRACKING,
	GET_BUDGET_TARGET_PROJECT,
} from "../../../../graphql/queries/budget";
import { GET_ANNUAL_YEAR_LIST, GET_ORG_CURRENCIES_BY_ORG } from "../../../../graphql/queries";
import { renderApollo } from "../../../../utils/test.util";
import { act } from "react-dom/test-utils";
import { NotificationProvider } from "../../../../contexts/notificationContext";
import { FORM_ACTIONS } from "../../../../models/budget/constants";
import { budgetLineItemInputFields } from "../../../../utils/inputTestFields.json";
import { projectDetails, organizationDetails } from "../../../../utils/testMock.json";
import { getTodaysDate } from "../../../../utils";

const handleClose = jest.fn();

let dialog: any;
let creationOccured = false;

const intialFormValue: any = {
	reporting_date: getTodaysDate(),
	amount: "213",
	note: "desc",
	budget_targets_project: "btp",
	annual_year: "ay",
};

const mockOrgBudgetTargetProject = [
	{
		id: "btp",
		name: "bud name 1",
		project: { id: "3", name: "my project" },
		budget_category_organization: {
			id: "1",
			name: "bud tar",
		},
		total_target_amount: 10,
		description: "desc",
		donor: {
			name: "donor1",
			id: "1",
		},
	},
];

const mockAnnualYearList = [
	{ id: "ay", name: "year 1", short_name: "sh1", start_date: "2020-03-03", end_date: "2020-04-04" },
];

const mockOrgHomeCurrency = [{ currency: { code: "INR" } }];

const mocks = [
	{
		request: {
			query: GET_BUDGET_TARGET_PROJECT,
			variables: {
				filter: {
					project: 3,
				},
			},
		},
		result: {
			data: {
				projectBudgetTargets: mockOrgBudgetTargetProject,
			},
		},
	},
	{
		request: {
			query: GET_ANNUAL_YEAR_LIST,
			variables: {},
		},
		result: {
			data: {
				annualYearList: mockAnnualYearList,
			},
		},
	},
	{
		request: {
			query: GET_ORG_CURRENCIES_BY_ORG,
			variables: {
				filter: {
					organization: "3",
					isHomeCurrency: true,
				},
			},
		},
		result: {
			data: {
				orgCurrencies: mockOrgHomeCurrency,
			},
		},
	},
	{
		request: {
			query: CREATE_PROJECT_BUDGET_TRACKING,
			variables: {
				input: {
					amount: 213,
					note: "desc",
					budget_targets_project: "btp",
					annual_year: "ay",
					reporting_date: new Date(getTodaysDate()),
				},
			},
		},
		result: () => {
			creationOccured = true;
			return {};
		},
	},
];

beforeEach(() => {
	act(() => {
		dialog = renderApollo(
			<NotificationProvider>
				<DashboardProvider
					defaultState={{ project: projectDetails, organization: organizationDetails }}
				>
					<CreateBudgetLineitemDialog
						formAction={FORM_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
					/>
				</DashboardProvider>
			</NotificationProvider>,
			{
				mocks,
				addTypename: false,
			}
		);
	});
});

const inputIds = budgetLineItemInputFields;

describe("Budget Line Item Dialog tests", () => {
	test("Mock response", async () => {
		for (let i = 0; i < inputIds.length; i++) {
			let fieldName = (await dialog.findByTestId(inputIds[i].id)) as HTMLInputElement;
			let value = intialFormValue[inputIds[i].key];
			await act(async () => {
				await fireEvent.change(fieldName, { target: { value } });
			});
			await expect(fieldName.value).toBe(value);
		}

		await act(async () => {
			let saveButton = await dialog.getByTestId("createSaveButton");
			expect(saveButton).toBeEnabled();
			fireEvent.click(saveButton);
			await wait();
		});

		await new Promise((resolve) => setTimeout(resolve, 1000));
		expect(creationOccured).toBe(true);
	});
});