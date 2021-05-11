import React from "react";
import ImpactTrackline from "../impactTrackLine";
import { act, fireEvent, queries, RenderResult, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IMPACT_ACTIONS } from "../constants";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_IMPACT_TARGET_BY_PROJECT,
} from "../../../graphql/Impact/target";
import {
	CREATE_IMPACT_TRACKLINE,
	GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
	GET_IMPACT_TRACKLINE_COUNT,
} from "../../../graphql/Impact/trackline";
import { GET_ANNUAL_YEARS, GET_PROJECT_DONORS, GET_FINANCIAL_YEARS } from "../../../graphql/index";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import {
	impactTargetMock,
	projectMock,
	impactTracklineByTargetMock,
	achieveValueMock,
} from "./testHelp";
import { getTodaysDate } from "../../../utils/index";
import { impactTracklineTestFields } from "./testInputField.json";
import {
	organizationDetail,
	annualYearListMock,
	projectDonorMock,
	financialYearListMock,
	mockOrgDonor,
} from "../../../utils/testMock.json";
import { GET_ALL_IMPACT_AMOUNT_SPEND } from "../../../graphql/Impact/query";
import { GET_ORG_DONOR } from "../../../graphql/donor";
import { GET_PROJ_DONORS } from "../../../graphql/project";

let createimpactTracklineFormMutation = false;
const mocks = [
	{
		request: {
			query: GET_IMPACT_TARGET_BY_PROJECT,
			variables: {
				filter: { project: 2 },
			},
		},
		result: { data: { impactTargetProjectList: impactTargetMock } },
	},
	{
		request: {
			query: GET_IMPACT_TARGET_BY_PROJECT,
			variables: {
				filter: { id: "14" },
			},
		},
		result: { data: { impactTargetProjectList: impactTargetMock } },
	},
	{
		request: {
			query: GET_IMPACT_TARGET_BY_PROJECT,
			variables: {
				sort: "created_at:DESC",
				limit: 1,
				start: 0,
				filter: { project: 2 },
			},
		},
		result: { data: { impactTargetProjectList: impactTargetMock } },
	},
	{
		request: {
			query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
			variables: {
				filter: { impact_target_project: "14" },
				sort: "created_at:DESC",
				limit: 1,
				start: 0,
			},
		},
		result: { data: { impactTrackingLineitemList: impactTracklineByTargetMock } },
	},
	{
		request: {
			query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
			variables: {
				filter: { impact_target_project: "" },
			},
		},
		result: { data: { impactTrackingLineitemList: impactTracklineByTargetMock } },
	},
	{
		request: {
			query: GET_IMPACT_TRACKLINE_COUNT,
			variables: { filter: { impact_target_project: "14" } },
		},
		result: { data: { impactTrackingLineitemListCount: 1 } },
	},
	{
		request: {
			query: CREATE_IMPACT_TRACKLINE,
			variables: {
				input: {
					impact_target_project: "14",
					value: 5000,
					annual_year: "1",
					financial_year: "1",
					reporting_date: new Date(getTodaysDate()),
					note: "",
				},
			},
		},
		result: () => {
			createimpactTracklineFormMutation = true;
			return { data: { createImpactTrackingLineitemInput: {} } };
		},
	},
	{
		request: {
			query: GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
			variables: { filter: { impact_target_project: "14" } },
		},
		result: {},
	},
	{
		request: {
			query: GET_ACHIEVED_VALLUE_BY_TARGET,
			variables: { filter: { impactTargetProject: "14" } },
		},
		result: { data: { impactTrackingSpendValue: achieveValueMock } },
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
			query: GET_FINANCIAL_YEARS,
			variables: { filter: { country: "1" } },
		},
		result: { data: { financialYearList: financialYearListMock } },
	},
	{
		request: {
			query: GET_ANNUAL_YEARS,
		},
		result: { data: { annualYears: annualYearListMock } },
	},
	{
		request: {
			query: GET_ALL_IMPACT_AMOUNT_SPEND,
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
let impactTracklineForm: RenderResult<typeof queries>;

beforeEach(async () => {
	impactTracklineForm = renderApollo(
		<DashboardProvider
			defaultState={{ project: projectMock, organization: organizationDetail }}
		>
			<NotificationProvider>
				<ImpactTrackline
					type={IMPACT_ACTIONS.CREATE}
					open={true}
					handleClose={handleClose}
					impactTarget={"14"}
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

describe("Impact Trackline Form", () => {
	impactTracklineTestFields.forEach((formField) => {
		test(`should have ${formField.name} field`, () => {
			let impactTracklineTestFieldsField = impactTracklineForm.getByTestId(
				formField.dataTestId
			);
			expect(impactTracklineTestFieldsField).toBeInTheDocument();
		});
	});

	test(`Submit Button enabels if all required field have values and Impact Trackline mutaion call`, async () => {
		for (let i = 0; i < impactTracklineTestFields.length; i++) {
			let formField = impactTracklineTestFields[i];
			if (formField.value) {
				let impactTracklineTestFieldsField = impactTracklineForm.getByTestId(
					formField.testId
				) as HTMLInputElement;
				fireEvent.change(impactTracklineTestFieldsField, {
					target: { value: formField.value },
				});

				await wait(() => {
					expect(impactTracklineTestFieldsField.value).toBe(formField.value);
				});
			}
		}

		let impactTracklineFormSubmit = await impactTracklineForm.findByTestId(`createSaveButton`);
		expect(impactTracklineFormSubmit).toBeEnabled();
		fireEvent.click(impactTracklineFormSubmit);

		new Promise((resolve) => setTimeout(resolve, 500))
			.then(() => {
				expect(createimpactTracklineFormMutation).toBe(true);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});
