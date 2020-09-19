import React from "react";
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
	arr,
	name,
	removeChip,
}: {
	arr: string[];
	name: string;
	removeChip: (index: number) => void;
}) => {
	return arr.map((element, index) => (
		<Box key={index} mx={1}>
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
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedImpactCategory: React.MutableRefObject<IImpactCategoryData | null>;
	initialValues: IImpactCategoryData;
	impactCategoryList: IImpactCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) {
	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid item xs={11}>
						<Box my={2} display="flex">
							{Object.entries(filterList).map((element) => {
								if (element[1] && typeof element[1] == "string") {
									return chipArray({
										arr: [element[1]],
										name: element[0].slice(0, 4),
										removeChip: (index: number) => {
											removeFilterListElements(element[0]);
										},
									});
								}
							})}
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
				editMenuName={["Edit Impact Category"]}
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
