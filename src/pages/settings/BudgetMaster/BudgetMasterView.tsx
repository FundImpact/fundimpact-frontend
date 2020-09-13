import React from "react";

import AddButton from "../../../components/Dasboard/AddButton";
import BudgetCategoryTable from "../../../components/Table/BudgetCategoryTable";
import { FORM_ACTIONS } from "../../../models/constants";
import BudgetCategory from "../../../components/Budget/BudgetCategory";
import { Box } from "@material-ui/core";
import { FormattedMessage } from "react-intl";

const BudgetMasterView = () => {
	return (
		<>
			<Box p={2}>
				<h1>
					<FormattedMessage
						id="budgetCategoriesHeading"
						defaultMessage="Budget Categories"
						description="This text is the heding of budget category table"
					/>
				</h1>
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

export default BudgetMasterView;
