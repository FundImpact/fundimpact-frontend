import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { IImpactUnitData } from "../../../models/impact/impact";
import ImpactUnitDialog from "../../Impact/ImpactUnitDialog/ImpaceUnitDialog";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import ImpactCategory from "../ImpactCategoryTable";
import { impactUnitTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import FilterList from "../../FilterList";
import { Grid, Box, Chip, Avatar, useTheme, Button, MenuItem } from "@material-ui/core";
import { impactUnitInputFields } from "../../../pages/settings/ImpactMaster/inputFields.json";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import {
	IMPACT_CATEGORY_TABLE_EXPORT,
	IMPACT_CATEGORY_UNIT_EXPORT,
	IMPACT_UNIT_TABLE_EXPORT,
	IMPACT_UNIT_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import { useAuth } from "../../../contexts/userContext";
import { exportTable } from "../../../utils/importExportTable.utils";
import { FormattedMessage } from "react-intl";

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
let impactUnitTableEditMenu: string[] = [];

function ImpactUnitTableView({
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
	impactUnitEditAccess,
	impactCategoryFindAccess,
	reftechImpactCategoryAndUnitTable,
	impactUnitDeleteAccess,
	impactUnitExportAccess,
	impactUnitImportFromCsvAccess,
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
	impactUnitEditAccess: boolean;
	impactCategoryFindAccess: boolean;
	reftechImpactCategoryAndUnitTable: () => void;
	impactUnitDeleteAccess: boolean;
	impactUnitImportFromCsvAccess: boolean;
	impactUnitExportAccess: boolean;
}) {
	useEffect(() => {
		if (impactUnitEditAccess) {
			impactUnitTableEditMenu[0] = "Edit Impact Unit";
		}
	}, [impactUnitEditAccess]);

	useEffect(() => {
		if (impactUnitDeleteAccess) {
			impactUnitTableEditMenu[1] = "Delete Impact Unit";
		}
	}, [impactUnitDeleteAccess]);

	// {
	// 	(!collapsableTable &&
	// 		(tableHeadings[tableHeadings.length - 1].renderComponent = () => (
	// 			<FilterList
	// 				initialValues={{
	// 					name: "",
	// 					code: "",
	// 					description: "",
	// 				}}
	// 				inputFields={impactUnitInputFields}
	// 				setFilterList={setFilterList}
	// 			/>
	// 		))) ||
	// 		(tableHeadings[tableHeadings.length - 1].renderComponent = undefined);
	// }
	const dashboardData = useDashBoardData();

	const onImportUnitTableSuccess = () => reftechImpactCategoryAndUnitTable();

	const theme = useTheme();
	const { jwt } = useAuth();

	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid item xs={12}>
						<Box flexWrap="wrap" display="flex">
							{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
								createChipArray({
									removeFilterListElements,
									filterListObjectKeyValuePair,
								})
							)}
						</Box>
					</Grid>
				</Grid>
			)}
			<CommonTable
				tableHeadings={
					collapsableTable && impactCategoryFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={impactUnitList}
				rows={rows}
				selectedRow={selectedImpactUnit}
				toggleDialogs={toggleDialogs}
				editMenuName={impactUnitTableEditMenu}
				collapsableTable={collapsableTable && impactCategoryFindAccess}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Impact Unit"
						tableExportUrl={IMPACT_UNIT_TABLE_EXPORT}
						tableImportUrl={IMPACT_UNIT_TABLE_IMPORT}
						importButtonOnly={importButtonOnly}
						onImportTableSuccess={onImportUnitTableSuccess}
						hideImport={!impactUnitImportFromCsvAccess}
						hideExport={!impactUnitExportAccess}
					>
						<>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1), float: "right" }}
								onClick={() =>
									exportTable({
										tableName: "Impact Unit Template",
										jwt: jwt as string,
										tableExportUrl: `${IMPACT_UNIT_TABLE_EXPORT}?header=true`,
									})
								}
							>
								Impact Unit Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			>
				<>
					<ImpactUnitDialog
						formAction={FORM_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						initialValues={initialValues}
						organization={dashboardData?.organization?.id || ""}
					/>
					<ImpactUnitDialog
						formAction={FORM_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						initialValues={initialValues}
						organization={dashboardData?.organization?.id || ""}
						dialogType={DIALOG_TYPE.DELETE}
					/>
				</>
				{/* {(rowData: { id: string }) => (
					<>
						<ImpactCategory
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

export default ImpactUnitTableView;
