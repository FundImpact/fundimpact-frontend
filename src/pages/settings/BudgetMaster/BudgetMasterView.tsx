import React from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import BudgetCategoryTable from "../../../components/Table/BudgetCategoryTable";
import { FORM_ACTIONS } from "../../../models/constants";
import BudgetCategory from "../../../components/Budget/BudgetCategory";
import { Box, Typography, Grid, Avatar } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FilterList from "../../../components/FilterList";
import Chip from "@material-ui/core/Chip";
import { budgetCategoryInputFields } from "./inputFields.json";

const BudgetMasterView = ({
	tableFilterList,
	setTableFilterList,
	removeFilteListElements,
}: {
	tableFilterList: {
		[key: string]: string;
	};
	setTableFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilteListElements: (elementToDelete: string) => void;
}) => {
	return (
		<>
			<Box p={2}>
				<Grid container>
					<Grid item xs={11}>
						<Typography variant="h4">
							<Box mt={2} fontWeight="fontWeightBold">
								<FormattedMessage
									id="budgetCategoriesHeading"
									defaultMessage="Budget Categories"
									description="This text is the heding of budget category table"
								/>
							</Box>
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							<FilterList
								setFilterList={setTableFilterList}
								inputFields={budgetCategoryInputFields}
							/>
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Box my={2} display="flex">
							{Object.entries(tableFilterList).map(
								(tableFilterListObjectKeyValuePair, index) =>
									tableFilterListObjectKeyValuePair[1] && (
										<Box key={index} mx={1}>
											<Chip
												label={tableFilterListObjectKeyValuePair[1]}
												avatar={
													<Avatar
														style={{
															width: "30px",
															height: "30px",
														}}
													>
														<span>{tableFilterListObjectKeyValuePair[0].slice(0, 4)}</span>
													</Avatar>
												}
												onDelete={() => removeFilteListElements(tableFilterListObjectKeyValuePair[0])}
											/>
										</Box>
									)
							)}
						</Box>
					</Grid>
				</Grid>
				<BudgetCategoryTable tableFilterList={tableFilterList} />
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
