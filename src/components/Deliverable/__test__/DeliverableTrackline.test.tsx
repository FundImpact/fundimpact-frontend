import "@testing-library/jest-dom/extend-expect";

import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import React from "react";

import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { GET_ANNUAL_YEARS } from "../../../graphql";
import {
	GET_ACHIEVED_VALLUE_BY_TARGET,
	GET_DELIVERABLE_TARGET_BY_PROJECT,
} from "../../../graphql/Deliverable/target";
import {
	CREATE_DELIVERABLE_TRACKLINE,
	GET_DELIVERABLE_TRACKLINE_BY_DELIVERABLE_TARGET,
} from "../../../graphql/Deliverable/trackline";
import { getTodaysDate } from "../../../utils";
import { renderApollo } from "../../../utils/test.util";
import { DELIVERABLE_ACTIONS } from "../constants";
import DeliverableTrackline from "../DeliverableTrackline";
import { annualYearListMock, DeliverableTargetMock, projectsMock } from "./testHelp";

let createDeliverableTracklineMutation = false;
const mocks = [
	{
		request: {
			query: GET_DELIVERABLE_TARGET_BY_PROJECT,
			variables: { filter: { project: 2 } },
		},
		result: { data: { deliverableTargetList: DeliverableTargetMock } },
	},
	{
		request: {
			query: GET_ANNUAL_YEARS,
		},
		result: { data: { annualYears: annualYearListMock } },
	},
	{
		request: {
			query: CREATE_DELIVERABLE_TRACKLINE,
			variables: {
				input: {
					deliverable_target_project: "1",
					value: 5000,
					annual_year: "1",
					note: "note",
					reporting_date: new Date(getTodaysDate()),
				},
			},
		},
		result: () => {
			createDeliverableTracklineMutation = true;
			return {};
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
		result: {},
	},
];
let handleClose = jest.fn();
let deliverableTrackline: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		deliverableTrackline = renderApollo(
			<DashboardProvider defaultState={{ project: projectsMock }}>
				<NotificationProvider>
					<DeliverableTrackline
						type={DELIVERABLE_ACTIONS.CREATE}
						open={true}
						handleClose={handleClose}
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

describe("Deliverable Trackline Form", () => {
	test("should have a target field", () => {
		let deliverableTracklineTarget = deliverableTrackline.getByTestId(
			"deliverableTracklineTarget"
		);
		expect(deliverableTracklineTarget).toBeInTheDocument();
	});
	test("should have a Value field", () => {
		let deliverableTracklineValue = deliverableTrackline.getByTestId(
			"deliverableTracklineValue"
		);
		expect(deliverableTracklineValue).toBeInTheDocument();
	});
	test("should have a Annaul year field", () => {
		let deliverableTracklineAnnualYear = deliverableTrackline.getByTestId(
			"deliverableTracklineAnnualYear"
		);
		expect(deliverableTracklineAnnualYear).toBeInTheDocument();
	});
	test("should have a note field", () => {
		let deliverableTracklineNote = deliverableTrackline.getByTestId("deliverableTracklineNote");
		expect(deliverableTracklineNote).toBeInTheDocument();
	});

	test("should have a date field", () => {
		let deliverableTracklineDate = deliverableTrackline.getByTestId("deliverableTracklineDate");
		expect(deliverableTracklineDate).toBeInTheDocument();
	});

	test("should have a submit button", () => {
		let deliverableTracklineSubmit = deliverableTrackline.getByTestId("createSaveButton");
		expect(deliverableTracklineSubmit).toBeInTheDocument();
	});

	test("Submit Button should be disabled if either of Target,value,annualyear,note fields is empty", async () => {
		let deliverableTracklineTarget = deliverableTrackline.getByTestId(
			"deliverableTracklineTargetInput"
		) as HTMLInputElement;

		let deliverableTracklineValue = deliverableTrackline.getByTestId(
			"deliverableTracklineValueInput"
		) as HTMLInputElement;

		let deliverableTracklineAnnualYear = deliverableTrackline.getByTestId(
			"deliverableTracklineAnnualYearInput"
		) as HTMLInputElement;

		let deliverableTracklineNote = deliverableTrackline.getByTestId(
			"deliverableTracklineNoteInput"
		) as HTMLInputElement;

		let value = "";
		act(() => {
			fireEvent.change(deliverableTracklineTarget, { target: { value } });
		});
		expect(deliverableTracklineTarget.value).toBe(value);

		act(() => {
			fireEvent.change(deliverableTracklineValue, { target: { value } });
		});
		expect(deliverableTracklineValue.value).toBe(value);

		act(() => {
			fireEvent.change(deliverableTracklineAnnualYear, { target: { value } });
		});
		expect(deliverableTracklineAnnualYear.value).toBe(value);

		act(() => {
			fireEvent.change(deliverableTracklineNote, { target: { value } });
		});
		expect(deliverableTracklineNote.value).toBe(value);

		let deliverableTracklineSubmit = await deliverableTrackline.findByTestId(
			`createSaveButton`
		);
		expect(deliverableTracklineSubmit).toBeDisabled();
	});

	test("Deliverable Trackline GraphQL Call on submit button", async () => {
		let deliverableTracklineTarget = deliverableTrackline.getByTestId(
			"deliverableTracklineTargetInput"
		) as HTMLInputElement;

		let deliverableTracklineValue = deliverableTrackline.getByTestId(
			"deliverableTracklineValueInput"
		) as HTMLInputElement;

		let deliverableTracklineAnnualYear = deliverableTrackline.getByTestId(
			"deliverableTracklineAnnualYearInput"
		) as HTMLInputElement;

		let deliverableTracklineNote = deliverableTrackline.getByTestId(
			"deliverableTracklineNoteInput"
		) as HTMLInputElement;

		act(() => {
			fireEvent.change(deliverableTracklineTarget, {
				target: { value: DeliverableTargetMock[0].id },
			});
		});
		expect(deliverableTracklineTarget.value).toBe(DeliverableTargetMock[0].id);

		act(() => {
			fireEvent.change(deliverableTracklineValue, { target: { value: "5000" } });
		});
		expect(deliverableTracklineValue.value).toBe("5000");

		act(() => {
			fireEvent.change(deliverableTracklineAnnualYear, {
				target: { value: annualYearListMock[0].id },
			});
		});
		expect(deliverableTracklineAnnualYear.value).toBe(annualYearListMock[0].id);

		act(() => {
			fireEvent.change(deliverableTracklineNote, { target: { value: "note" } });
		});
		expect(deliverableTracklineNote.value).toBe("note");
		let deliverableTracklineSubmit = await deliverableTrackline.findByTestId(
			`createSaveButton`
		);
		expect(deliverableTracklineSubmit).toBeEnabled();
		act(() => {
			fireEvent.click(deliverableTracklineSubmit);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(createDeliverableTracklineMutation).toBe(true);
	});
});
