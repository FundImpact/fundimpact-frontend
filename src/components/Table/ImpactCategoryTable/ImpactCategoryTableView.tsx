import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactCategoryData } from "../../../models/impact/impact";
import ImpactUnit from "../ImpactUnitTable";
import { impactCategoryTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { Grid, Box, Avatar, Chip, MenuItem, Button, useTheme } from "@material-ui/core";
import FilterList from "../../FilterList";
import { impactCategoryInputFields } from "../../../pages/settings/ImpactMaster/inputFields.json";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	IMPACT_CATEGORY_TABLE_EXPORT,
	IMPACT_CATEGORY_TABLE_IMPORT,
	IMPACT_CATEGORY_UNIT_EXPORT,
} from "../../../utils/endpoints.util";
import { ApolloQueryResult } from "@apollo/client";
import { exportTable } from "../../../utils/importExportTable.utils";
import { FormattedMessage } from "react-intl";
import { useAuth } from "../../../contexts/userContext";

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
	impactCategoryEditAccess,
	impactUnitFindAccess,
	reftechImpactCategoryAndUnitTable,
	impactCategoryDeleteAccess,
	impactCategoryExportAccess,
	impactCategoryImportFromCsvAccess,
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
	impactCategoryEditAccess: boolean;
	impactUnitFindAccess: boolean;
	reftechImpactCategoryAndUnitTable: () => void;
	impactCategoryDeleteAccess: boolean;
	impactCategoryImportFromCsvAccess: boolean;
	impactCategoryExportAccess: boolean;
}) {
	useEffect(() => {
		if (impactCategoryEditAccess) {
			impactCategoryTableEditMenu[0] = "Edit Impact Category";
		}
	}, [impactCategoryEditAccess]);
	useEffect(() => {
		if (impactCategoryDeleteAccess) {
			impactCategoryTableEditMenu[1] = "Delete Impact Category";
		}
	}, [impactCategoryDeleteAccess]);
	// {
	// 	(!collapsableTable &&
	// 		(tableHeadings[tableHeadings.length - 1].renderComponent = () => (
	// 			<FilterList
	// 				initialValues={{
	// 					name: "",
	// 					code: "",
	// 					description: "",
	// 				}}
	// 				setFilterList={setFilterList}
	// 				inputFields={impactCategoryInputFields}
	// 			/>
	// 		))) ||
	// 		(tableHeadings[tableHeadings.length - 1].renderComponent = undefined);
	// }

	const onImportImpactCategoryTableSuccess = () => reftechImpactCategoryAndUnitTable();
	const { jwt } = useAuth();
	const theme = useTheme();

	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid item xs={12}>
						<Box display="flex" flexWrap="wrap">
							{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
								createChipArray({
									filterListObjectKeyValuePair,
									removeFilterListElements,
								})
							)}
						</Box>
					</Grid>
				</Grid>
			)}
			<CommonTable
				tableHeadings={
					collapsableTable && impactUnitFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={impactCategoryList}
				rows={rows}
				selectedRow={selectedImpactCategory}
				toggleDialogs={toggleDialogs}
				editMenuName={impactCategoryTableEditMenu}
				collapsableTable={collapsableTable && impactUnitFindAccess}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Impact Category"
						tableExportUrl={IMPACT_CATEGORY_TABLE_EXPORT}
						tableImportUrl={IMPACT_CATEGORY_TABLE_IMPORT}
						importButtonOnly={importButtonOnly}
						onImportTableSuccess={onImportImpactCategoryTableSuccess}
						hideImport={!impactCategoryImportFromCsvAccess}
						hideExport={!impactCategoryExportAccess}
					>
						<Button
							variant="outlined"
							style={{ marginRight: theme.spacing(1), float: "right" }}
							onClick={() =>
								exportTable({
									tableName: "Impact Category Template",
									jwt: jwt as string,
									tableExportUrl: `${IMPACT_CATEGORY_TABLE_EXPORT}?header=true`,
								})
							}
						>
							Impact Category Template
						</Button>
					</ImportExportTableMenu>
				)}
			>
				<>
					<ImpactCategoryDialog
						formAction={FORM_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						initialValues={initialValues}
					/>
					<ImpactCategoryDialog
						formAction={FORM_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						initialValues={initialValues}
						dialogType={DIALOG_TYPE.DELETE}
					/>
				</>
				{/* {(rowData: { id: string }) => (
					<>
						<ImpactUnit
							tableFilterList={filterList}
							rowId={rowData.id}
							collapsableTable={false}
						/>
					</>
				)} */}
			</CommonTable>
		</>
	);
}

export default ImpactCategoryTableView;
