// import React from "react";
// import CreateBudgetDialog from "../CreateBudgetDialog";
// import { queries, render, act, RenderResult } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
// import { DashboardProvider } from "../../../../contexts/dashboardContext";
// import { CREATE_ORG_BUDGET_CATEGORY } from "../../../../graphql/queries/budget";
// import { renderApollo } from "../../../../utils/test.util";

// const handleClose = jest.fn();

// const mocks = [
// 	{
// 		request: {
// 			query: CREATE_ORG_BUDGET_CATEGORY,
// 			variables: {
// 				input: {
// 					organization: "2",
// 					name: "my name",
// 					description: "desc",
// 					code: "code 1",
// 				},
// 			},
// 		},
// 		result: {
// 			name: "my name",
// 			code: "code 1",
// 		},
// 	},
// ];

// let dialog: RenderResult<typeof queries>;

// beforeEach(() => {
// 	act(() => {
// 		dialog = render(
// 			<DashboardProvider>
// 				<MockedProvider mocks={mocks}>
// 					<CreateBudgetDialog open={true} handleClose={handleClose} />
// 				</MockedProvider>
// 			</DashboardProvider>
// 		);
// 	});
// });

// it("Dialog is rendered correctly", () => {
// 	const conponent = dialog.getByTestId("create-budget-dialog");
// 	expect(conponent).toBeInTheDocument();
// });

// it("Dialog render header correctly", () => {
// 	const header = dialog.getByTestId("create-budget-dialog-header");
// 	expect(header).toHaveTextContent("New Budget");
// });

// // import React from "react";
// // import CreateBudgetTargetDialog from "../CreateBudgetTargetDialog";
// // import { queries, render, act, RenderResult } from "@testing-library/react";
// // import "@testing-library/jest-dom/extend-expect";
// // import { BUDGET_ACTIONS } from "../../../../models/budget/constants";

// // const handleClose = jest.fn();

// // let dialog: RenderResult<typeof queries>;

// // beforeEach(() => {
// // 	act(() => {
// // 		dialog = render(
// // 			<CreateBudgetTargetDialog
// // 				formAction={BUDGET_ACTIONS.CREATE}
// // 				open={true}
// //         handleClose={handleClose}
// // 			/>
// // 		);
// // 	});
// // });

// // it("Dialog is rendered correctly", () => {
// // 	const conponent = dialog.getByTestId("create-budget-target-dialog");
// // 	expect(conponent).toBeInTheDocument();
// // });

// // it("Dialog render header correctly", () => {
// // 	const header = dialog.getByTestId("create-budget-target-dialog-header");
// // 	expect(header).toHaveTextContent("New Budget Target");
// // });
