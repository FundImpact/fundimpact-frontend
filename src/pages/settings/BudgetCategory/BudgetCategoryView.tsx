import React from "react";

import AddButton from "../../../components/Dasboard/AddButton";
import BudgetCategoryTable from "../../../components/Table/BudgetCategory";
import { FORM_ACTIONS } from "../../../models/constants";
import BudgetCategory from "../../../components/Budget/BudgetCategory";
import { Box } from "@material-ui/core";

const BudgetCategoryView = () => {
	return (
		<>
			<Box p={2}>
				<h1>Budget Categories</h1>
				<BudgetCategoryTable />
				<AddButton
					createButtons={[]}
					buttonAction={{
						dialog: ({
							open,
							handleClose,
						}: {
							open: boolean;
							handleClose: () => void;
						}) => (
							<BudgetCategory
								open={open}
								handleClose={handleClose}
								formAction={FORM_ACTIONS.CREATE}
							/>
						),
					}}
				/>
			</Box>
		</>
	);
};

export default BudgetCategoryView;
