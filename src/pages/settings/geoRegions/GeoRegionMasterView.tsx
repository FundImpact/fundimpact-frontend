import React from "react";
import AddButton from "../../../components/Dasboard/AddButton";
import BudgetCategoryTable from "../../../components/Table/BudgetCategoryTable";
import GeoRegionsTable from "../../../components/Table/GeoRegions";
import { FORM_ACTIONS } from "../../../models/constants";
import BudgetCategory from "../../../components/Budget/BudgetCategory";
import { Box, Typography, Grid, Avatar } from "@material-ui/core";
import { FormattedMessage } from "react-intl";
import FilterList from "../../../components/FilterList";
import Chip from "@material-ui/core/Chip";
import { GeoRegionsInputFields } from "./inputField.json";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { BUDGET_CATEGORY_ACTIONS } from "../../../utils/access/modules/budgetCategory/actions";
import { GEO_REGIONS_ACTIONS } from "../../../utils/access/modules/geoRegions/actions";
import GeoRegions from "../../../components/GeoRegions";

const GeoRegionsMasterView = ({
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
	const createGeoRegionsAccess = userHasAccess(
		// const createBudgetCategoryAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.CREATE_BUDGET_CATEGORY
	);

	// const createGeoRegionsAccess = userHasAccess(
	// 	MODULE_CODES.BUDGET_CATEGORY,
	//  GEO_REGIONS_ACTIONS.CREATE_GEO_REGIONS
	// );

	const geoRegionsFindAccess = userHasAccess(
		// const budgetCategoryFindAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.FIND_BUDGET_CATEGORY
	);

	const filterObject = Object.entries(tableFilterList).map((e, i) => {});

	return (
		<>
			<Box p={2}>
				<Grid container>
					<Grid item xs={11}>
						<Typography variant="h4">
							<Box mt={2} fontWeight="fontWeightBold">
								<FormattedMessage
									id="geoRegionsHeading"
									defaultMessage="Geo Regions"
									description="This text is the heding of budget category table"
								/>
							</Box>
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							{geoRegionsFindAccess && (
								<FilterList
									setFilterList={setTableFilterList}
									inputFields={GeoRegionsInputFields}
									initialValues={{ name: "", description: "" }}
								/>
							)}
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
														<span>
															{tableFilterListObjectKeyValuePair[0].slice(
																0,
																4
															)}
														</span>
													</Avatar>
												}
												onDelete={() =>
													removeFilteListElements(
														tableFilterListObjectKeyValuePair[0]
													)
												}
											/>
										</Box>
									)
							)}
						</Box>
					</Grid>
				</Grid>
				{geoRegionsFindAccess && <GeoRegionsTable tableFilterList={tableFilterList} />}
				{createGeoRegionsAccess && (
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
								<GeoRegions
									open={open}
									handleClose={handleClose}
									formAction={FORM_ACTIONS.CREATE}
								/>
							),
						}}
					/>
				)}
			</Box>
		</>
	);
};

export default GeoRegionsMasterView;
