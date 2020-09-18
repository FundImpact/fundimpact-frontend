import React from "react";
import ImpactTarget from "../impactTarget";
import { act, fireEvent, queries, RenderResult, wait } from "@testing-library/react";
import { IImpactTarget } from "../../../models/impact/impactTarget";
import { IMPACT_ACTIONS } from "../constants";
import { GET_IMPACT_CATEGORY_BY_ORG } from "../../../graphql/Impact/query";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { organizationDetail } from "../../../utils/testMock.json";
import { impactTargetTestField } from "./testInputField.json";
import { GET_IMPACT_CATEGORY_UNIT } from "../../../graphql/Impact/categoryUnit";
import {
	impactCategoryMock,
	impactCategoryUnitMock,
	sustainableDevelopmentGoalMock,
	impactTargetMock,
} from "./testHelp";
import { CREATE_IMPACT_TARGET, GET_IMPACT_TARGET_BY_PROJECT } from "../../../graphql/Impact/target";
import { GET_SDG } from "../../../graphql/SDG/query";

let createimpactTargetFormMutation = false;
const mocks = [
	{
		request: {
			query: GET_IMPACT_CATEGORY_BY_ORG,
			variables: { filter: { organization: "13" } },
		},
		result: { data: { impactCategoryOrgList: impactCategoryMock } },
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_UNIT,
			variables: { filter: { impact_category_org: "1" } },
		},
		result: { data: { impactCategoryUnitList: impactCategoryUnitMock } },
	},
	{
		request: {
			query: GET_IMPACT_CATEGORY_UNIT,
			variables: { filter: { impact_category_org: "1", impact_units_org: "1" } },
		},
		result: { data: { impactCategoryUnitList: impactCategoryUnitMock } },
	},
	{
		request: {
			query: GET_SDG,
		},
		result: { data: { sustainableDevelopmentGoalList: sustainableDevelopmentGoalMock } },
	},
	{
		request: {
			query: CREATE_IMPACT_TARGET,
			variables: {
				input: {
					name: "IMPACTTARGET",
					target_value: 5000,
					impact_category_unit: "1",
					description: "",
					sustainable_development_goal: "",
					project: 1,
				},
			},
		},
		result: () => {
			createimpactTargetFormMutation = true;
			return { data: { createImpactTargetProjectInput: {} } };
		},
	},
	{
		request: {
			query: GET_IMPACT_TARGET_BY_PROJECT,
			variables: {
				filter: { project: 1 },
			},
		},
		result: { data: { impactTargetProjectList: impactTargetMock } },
	},
];

let impactTarget: RenderResult<typeof queries>;
let handleClose = jest.fn();
jest.setTimeout(30000);
beforeEach(() => {
	act(() => {
		impactTarget = renderApollo(
			<DashboardProvider defaultState={{ organization: organizationDetail }}>
				<NotificationProvider>
					<ImpactTarget
						type={IMPACT_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
						project={1}
					/>
				</NotificationProvider>
			</DashboardProvider>,
			{
				mocks,
				resolvers: {},
			}
		);
	});
});

describe("Impact Target Form", () => {
	impactTargetTestField.forEach((formField) => {
		test(`should have ${formField.name} field`, () => {
			let impactTargetTestFieldField = impactTarget.getByTestId(formField.dataTestId);
			expect(impactTargetTestFieldField).toBeInTheDocument();
		});
	});

	test(`Submit Button enabels if all required field have values and Impact Target mutaion call`, async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		for (let i = 0; i < impactTargetTestField.length; i++) {
			let formField = impactTargetTestField[i];
			if (formField.value) {
				let impactTargetTestFieldField = impactTarget.getByTestId(
					formField.testId
				) as HTMLInputElement;
				act(() => {
					fireEvent.change(impactTargetTestFieldField, {
						target: { value: formField.value },
					});
				});

				await wait(() => expect(impactTargetTestFieldField.value).toBe(formField.value));
			}
		}

		let impactTracklineFormSubmit = await impactTarget.findByTestId(`createSaveButton`);
		expect(impactTracklineFormSubmit).toBeEnabled();
		act(() => {
			fireEvent.click(impactTracklineFormSubmit);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(createimpactTargetFormMutation).toBe(true);
	});
});
