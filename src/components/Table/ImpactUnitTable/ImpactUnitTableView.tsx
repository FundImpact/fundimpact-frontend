import React from "react";
import CommonTable from "../CommonTable";
import { FORM_ACTIONS } from "../../../models/constants";
import { IImpactUnitData } from "../../../models/impact/impact";
import ImpactUnitDialog from "../../Impact/ImpactUnitDialog/ImpaceUnitDialog";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import ImpactCategory from "../ImpactCategoryTable";
import { impactUnitTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import FilterList from "../../FilterList";
import { Grid, Box, Chip, Avatar } from "@material-ui/core";
import { impactUnitInputFields } from "../../../pages/settings/ImpactMaster/inputFields.json";

const rows = [
	{
		valueAccessKey: "name",
	},
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (impactUnit: IImpactUnitData) => (
			<UnitsAndCategoriesProjectCount impactUnitId={impactUnit.id} />
		),
	},
	{ valueAccessKey: "" },
];

const chipArray = ({
	removeChip,
	name,
	arr,
}: {
	removeChip: (index: number) => void;
	name: string;
	arr: string[];
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

function ImpactUnitTableContainer({
	toggleDialogs,
	openDialogs,
	selectedImpactUnit,
	initialValues,
	impactUnitList,
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
	selectedImpactUnit: React.MutableRefObject<IImpactUnitData | null>;
	initialValues: IImpactUnitFormInput;
	impactUnitList: IImpactUnitData[];
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
								inputFields={impactUnitInputFields}
							/>
						</Box>
					</Grid>
				</Grid>
			)}
			<CommonTable
				tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
				valuesList={impactUnitList}
				rows={rows}
				selectedRow={selectedImpactUnit}
				toggleDialogs={toggleDialogs}
				editMenuName={["Edit Impact Unit"]}
				collapsableTable={collapsableTable}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			>
				<ImpactUnitDialog
					formAction={FORM_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(0, false)}
					open={openDialogs[0]}
					initialValues={initialValues}
				/>
				{(rowData: { id: string }) => (
					<>
						<ImpactCategory rowId={rowData.id} collapsableTable={false} />
					</>
				)}
			</CommonTable>
		</>
	);
}

export default ImpactUnitTableContainer;
