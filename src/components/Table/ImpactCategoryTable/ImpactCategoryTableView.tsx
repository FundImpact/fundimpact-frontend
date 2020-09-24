import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactCategoryData } from "../../../models/impact/impact";
import ImpactUnit from "../ImpactUnitTable";
import { impactCategoryTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { Grid, Box, Avatar, Chip } from "@material-ui/core";
import FilterList from "../../FilterList";
import { impactCategoryInputFields } from "../../../pages/settings/ImpactMaster/inputFields.json";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { IMPACT_CATEGORY_ACTIONS } from "../../../utils/access/modules/impactCategory/actions";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (impactCategory: IImpactCategoryData) => (
			<UnitsAndCategoriesProjectCount impactCategoryId={impactCategory.id} />
		),
	},
	{ valueAccessKey: "" },
];

const chipArray = ({
	elementList,
	name,
	removeChip,
}: {
	elementList: string[];
	name: string;
	removeChip: (index: number) => void;
}) => {
	return elementList.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				onDelete={() => removeChip(index)}
			/>
		</Box>
	));
};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArray({
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			elementList: [filterListObjectKeyValuePair[1]],
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};
let impactCategoryTableEditMenu: string[] = [];

function ImpactCategoryTableView({
	toggleDialogs,
	openDialogs,
	selectedImpactCategory,
	initialValues,
	impactCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	filterList,
	setFilterList,
	removeFilterListElements,
}: {
	openDialogs: boolean[];
	initialValues: IImpactCategoryData;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	impactCategoryList: IImpactCategoryData[];
	orderBy: string;
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	selectedImpactCategory: React.MutableRefObject<IImpactCategoryData | null>;
	count: number;
	loading: boolean;
	toggleDialogs: (index: number, val: boolean) => void;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	order: "asc" | "desc";
	filterList: {
		[key: string]: string;
	};
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}) {
	const impactCategoryEditAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.UPDATE_IMPACT_CATEGORY
	);

	useEffect(() => {
		if (impactCategoryEditAccess) {
			impactCategoryTableEditMenu = ["Edit Impact Category"];
		}
	}, [impactCategoryEditAccess]);

	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid item xs={11}>
						<Box my={2} display="flex" flexWrap="wrap">
							{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
								createChipArray({
									filterListObjectKeyValuePair,
									removeFilterListElements,
								})
							)}
						</Box>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							<FilterList
								initialValues={{
									name: "",
									code: "",
									description: "",
								}}
								setFilterList={setFilterList}
								inputFields={impactCategoryInputFields}
							/>
						</Box>
					</Grid>
				</Grid>
			)}
			<CommonTable
				tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
				valuesList={impactCategoryList}
				rows={rows}
				selectedRow={selectedImpactCategory}
				toggleDialogs={toggleDialogs}
				editMenuName={impactCategoryTableEditMenu}
				collapsableTable={collapsableTable}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			>
				<ImpactCategoryDialog
					formAction={FORM_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(0, false)}
					open={openDialogs[0]}
					initialValues={initialValues}
				/>
				{(rowData: { id: string }) => (
					<>
						<ImpactUnit
							tableFilterList={filterList}
							rowId={rowData.id}
							collapsableTable={false}
						/>
					</>
				)}
			</CommonTable>
		</>
	);
}

export default ImpactCategoryTableView;
