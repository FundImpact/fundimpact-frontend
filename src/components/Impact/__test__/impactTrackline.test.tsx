import React from "react";
import { act, fireEvent, queries, RenderResult } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { IMPACT_ACTIONS } from "../constants";
import {
	GET_IMPACT_TARGET_BY_PROJECT,
	GET_ACHIEVED_VALLUE_BY_TARGET,
} from "../../../graphql/queries/Impact/target";
import {
	CREATE_IMPACT_TRACKLINE,
	GET_IMPACT_TRACKLINE_BY_IMPACT_TARGET,
} from "../../../graphql/queries/Impact/trackline";
import { GET_ANNUAL_YEARS } from "../../../graphql/queries/index";
import { renderApollo } from "../../../utils/test.util";
import { DashboardProvider } from "../../../contexts/dashboardContext";
import { NotificationProvider } from "../../../contexts/notificationContext";
import { impactTargetMock, projectMock, annualYearListMock } from "./testHelp";
import { getTodaysDate } from "../../../utils/index";
import ImpactTrackLine from "../impactTrackLine";

let createimpactTracklineMutation = false;
const mocks = [
	{
		request: {
			query: GET_IMPACT_TARGET_BY_PROJECT,
			variables: { filter: { project: 2 } },
		},
		result: { data: { impactTargetProjectList: impactTargetMock } },
	},
	{
		request: {
			query: GET_ANNUAL_YEARS,
		},
		result: { data: { annualYears: annualYearListMock } },
	},
	{
		request: {
			query: CREATE_IMPACT_TRACKLINE,
			variables: {
				input: {
					impact_target_project: "14",
					annual_year: "1",
					value: 63000,
					reporting_date: new Date(getTodaysDate()),
					note: "note",
				},
			},
		},
		result: () => {
			createimpactTracklineMutation = true;
			return {};
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
		result: {},
	},
];
let handleClose = jest.fn();
let impactTrackline: RenderResult<typeof queries>;

beforeEach(() => {
	act(() => {
		impactTrackline = renderApollo(
			<DashboardProvider defaultState={{ project: projectMock }}>
				<NotificationProvider>
					<ImpactTrackLine
						type={IMPACT_ACTIONS.CREATE}
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

describe("Impact Trackline Form", () => {
	test("should have a target field", () => {
		let impactTracklineTarget = impactTrackline.getByTestId("impactTracklineTarget");
		expect(impactTracklineTarget).toBeInTheDocument();
	});
	test("should have a Value field", () => {
		let impactTracklineValue = impactTrackline.getByTestId("impactTracklineValue");
		expect(impactTracklineValue).toBeInTheDocument();
	});
	test("should have a Annaul year field", () => {
		let impactTracklineAnnualYear = impactTrackline.getByTestId("impactTracklineAnnualYear");
		expect(impactTracklineAnnualYear).toBeInTheDocument();
	});
	test("should have a note field", () => {
		let impactTracklineNote = impactTrackline.getByTestId("impactTracklineNote");
		expect(impactTracklineNote).toBeInTheDocument();
	});

	test("should have a date field", () => {
		let impactTracklineDate = impactTrackline.getByTestId("impactTracklineDate");
		expect(impactTracklineDate).toBeInTheDocument();
	});

	test("should have a submit button", () => {
		let impactTracklineSubmit = impactTrackline.getByTestId("createSaveButton");
		expect(impactTracklineSubmit).toBeInTheDocument();
	});

	test("Submit Button should be disabled if either of Target,value ,annualyear,note fields is empty", async () => {
		let impactTracklineTarget = impactTrackline.getByTestId(
			"impactTracklineTargetInput"
		) as HTMLInputElement;

		let impactTracklineValue = impactTrackline.getByTestId(
			"impactTracklineValueInput"
		) as HTMLInputElement;

		let impactTracklineAnnualYear = impactTrackline.getByTestId(
			"impactTracklineAnnualYearInput"
		) as HTMLInputElement;

		let impactTracklineNote = impactTrackline.getByTestId(
			"impactTracklineNoteInput"
		) as HTMLInputElement;

		let value = "";
		act(() => {
			fireEvent.change(impactTracklineTarget, { target: { value } });
		});
		expect(impactTracklineTarget.value).toBe(value);

		act(() => {
			fireEvent.change(impactTracklineValue, { target: { value } });
		});
		expect(impactTracklineValue.value).toBe(value);

		act(() => {
			fireEvent.change(impactTracklineAnnualYear, { target: { value } });
		});
		expect(impactTracklineAnnualYear.value).toBe(value);

		act(() => {
			fireEvent.change(impactTracklineNote, { target: { value } });
		});
		expect(impactTracklineNote.value).toBe(value);

		let impactTracklineSubmit = await impactTrackline.findByTestId(`createSaveButton`);
		expect(impactTracklineSubmit).toBeDisabled();
	});

	test("Impact Trackline GraphQL Call on submit button", async () => {
		let impactTracklineTarget = impactTrackline.getByTestId(
			"impactTracklineTargetInput"
		) as HTMLInputElement;

		let impactTracklineValue = impactTrackline.getByTestId(
			"impactTracklineValueInput"
		) as HTMLInputElement;

		let impactTracklineAnnualYear = impactTrackline.getByTestId(
			"impactTracklineAnnualYearInput"
		) as HTMLInputElement;

		let impactTracklineNote = impactTrackline.getByTestId(
			"impactTracklineNoteInput"
		) as HTMLInputElement;

		act(() => {
			fireEvent.change(impactTracklineTarget, {
				target: { value: impactTargetMock[0].id },
			});
		});
		expect(impactTracklineTarget.value).toBe(impactTargetMock[0].id);

		act(() => {
			fireEvent.change(impactTracklineValue, { target: { value: "63000" } });
		});
		expect(impactTracklineValue.value).toBe("63000");

		act(() => {
			fireEvent.change(impactTracklineAnnualYear, {
				target: { value: annualYearListMock[0].id },
			});
		});
		expect(impactTracklineAnnualYear.value).toBe(annualYearListMock[0].id);

		act(() => {
			fireEvent.change(impactTracklineNote, { target: { value: "note" } });
		});
		expect(impactTracklineNote.value).toBe("note");
		let impactTracklineSubmit = await impactTrackline.findByTestId(`createSaveButton`);
		expect(impactTracklineSubmit).toBeEnabled();
		act(() => {
			fireEvent.click(impactTracklineSubmit);
		});
		await new Promise((resolve) => setTimeout(resolve, 1000)); // wait for response
		expect(createimpactTracklineMutation).toBe(true);
	});
});
