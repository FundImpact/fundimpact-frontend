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

const chipArr = ({
	removeChip,
	name,
	arr,
}: {
	removeChip: (index: number) => void;
	name: string;
	arr: string[];
}) => {
	return arr.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
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
				label={element}
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
		return chipArr({
			arr: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
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
