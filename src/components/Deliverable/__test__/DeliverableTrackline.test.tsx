import React from "react";
import DeliverableTrackline from "../DeliverableTrackline";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { DELIVERABLE_ACTIONS } from "../constants";
import {
	GET_DELIVERABLE_TARGET_BY_PROJECT,
	GET_ACHIEVED_VALLUE_BY_TARGET,
} from "../../../graphql/Deliverable/target";
import {
	CREATE_DELIVERABLE_TRACKLINE,
	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
	GET_DELIVERABLE_TRACKLINE_COUNT,
} from "../../../graphql/Deliverable/trackline";
import { GET_ANNUAL_YEARS, GET_PROJECT_DONORS, GET_FINANCIAL_YEARS } from "../../../graphql/index";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { DeliverableTargetMock, projectsMock, DeliverableTracklineByTargetMock } from "./testHelp";
import { getTodaysDate } from "../../../utils/index";
import { deliverableTracklineForm } from "./testInputField.json";
import {
	organizationDetail,
	annualYearListMock,
	projectDonorMock,
	financialYearListMock,
	mockOrgDonor,
} from "../../../utils/testMock.json";
import { mockUserRoles } from "../../../utils/testMockUserRoles.json";
import { GET_USER_ROLES } from "../../../graphql/User/query";
import { GET_ALL_DELIVERABLES_SPEND_AMOUNT, GET_PROJ_DONORS } from "../../../graphql/project";
import { GET_ORG_DONOR } from "../../../graphql/donor";
let createDeliverableTracklineMutation = false;
const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: {
				filter: { project: 2 },
			},
		},
		result: { data: { deliverableTargetList: DeliverableTargetMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: {
				filter: { id: "1" },
			},
		},
		result: { data: { deliverableTargetList: DeliverableTargetMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: {
				sort: "created_at:DESC",
				limit: 1,
				start: 0,
				filter: { project: 2 },
			},
		},
		result: { data: { deliverableTargetList: DeliverableTargetMock } },
	},
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
			query: GET_ANNUAL_YEARS,
		},
		result: { data: { annualYears: annualYearListMock } },
	},
	{
		request: {
			query: GET_FINANCIAL_YEARS,
			variables: { filter: { country: "1" } },
		},
		result: { data: { financialYearList: financialYearListMock } },
	},
	{
		request: {
			query: GET_PROJ_DONORS,
			variables: { filter: { project: 2 } },
		},
		result: { data: { projectDonors: projectDonorMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
			variables: {
				filter: { deliverable_target_project: "1" },
				sort: "created_at:DESC",
				limit: 1,
				start: 0,
			},
		},
		result: { data: { deliverableTrackingLineitemList: DeliverableTracklineByTargetMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
			variables: {
				filter: { deliverable_target_project: "" },
			},
		},
		result: { data: { deliverableTrackingLineitemList: DeliverableTracklineByTargetMock } },
	},
	{
		request: {
			query: GET_DELIVERABLE_TRACKLINE_COUNT,
			variables: { filter: { deliverable_target_project: "1" } },
		},
		result: { data: { deliverableTrackingLineitemCount: 1 } },
	},
	{
		request: {
			query: CREATE_DELIVERABLE_TRACKLINE,
			variables: {
				input: {
					deliverable_target_project: "1",
					value: 5000,
					annual_year: "1",
					financial_year: "1",
					reporting_date: new Date(getTodaysDate()),
					note: "",
				},
			},
		},
		result: () => {
			createDeliverableTracklineMutation = true;
			return { data: { createDeliverableTrackingLineitemDetail: {} } };
		},
	},
	{
		request: {
			query: GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
			variables: { filter: { deliverable_target_project: "1" } },
		},
		result: {},
	},
	{
		request: {
			query: GET_ACHIEVED_VALLUE_BY_TARGET,
			variables: { filter: { deliverableTargetProject: "1" } },
		},
		result: { data: { deliverableTrackingTotalValue: 0 } },
	},
	{
		request: {
			query: GET_ALL_DELIVERABLES_SPEND_AMOUNT,
			variables: {
				filter: { project: 2 },
			},
		},
		result: {},
	},
	{
		request: {
			query: GET_ORG_DONOR,
			variables: {
				filter: {
					organization: "13",
				},
			},
		},
		result: {
			data: {
				orgDonors: mockOrgDonor,
			},
		},
	},
];
let handleClose = jest.fn();
let deliverableTrackline: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		deliverableTrackline = renderApollo(
			<DashboardProvider
				defaultState={{ project: projectsMock, organization: organizationDetail }}
			>
				<NotificationProvider>
					<DeliverableTrackline
						type={DELIVERABLE_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
						deliverableTarget={"1"}
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

describe("Deliverable Trackline Form", () => {
	deliverableTracklineForm.forEach((formField) => {
		test(`should have ${formField.name} field`, () => {
			let deliverableTracklineFormField = deliverableTrackline.getByTestId(
				formField.dataTestId
			);
			expect(deliverableTracklineFormField).toBeInTheDocument();
		});
	});

	test(`Submit Button enabels if all required field is have values and Deliverable Trackline mutaion call`, async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		for (let i = 0; i < deliverableTracklineForm.length; i++) {
			let formField = deliverableTracklineForm[i];
			if (formField.value) {
				let deliverableTracklineFormField = deliverableTrackline.getByTestId(
					formField.testId
				) as HTMLInputElement;
				act(() => {
					fireEvent.change(deliverableTracklineFormField, {
						target: { value: formField.value },
					});
				});

				expect(deliverableTracklineFormField.value).toBe(formField.value);
			}
		}

		let deliverableTracklineSubmit = await deliverableTrackline.findByTestId(
			`createSaveButton`
		);
		expect(deliverableTracklineSubmit).toBeEnabled();
		act(async () => {
			fireEvent.click(deliverableTracklineSubmit);
		});

		new Promise((resolve) => setTimeout(resolve, 500))
			.then(() => {
				expect(createDeliverableTracklineMutation).toBe(true);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});
