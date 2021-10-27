import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import DeliverableUnit from "../../Deliverable/DeliverableUnit";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import DeliverableCategory from "../DeliverableCategoryTable";
import { GeographiesBlockTableHeading as tableHeadings } from "../constants";
// import { deliverableUnitTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { Grid, Box, Chip, Avatar, Button, useTheme, MenuItem } from "@material-ui/core";
import FilterList from "../../FilterList";
import { deliverableUnitInputFields } from "../../../pages/settings/DeliverableMaster/inputFields.json";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import {
	DELIVERABLE_CATEGORY_TABLE_EXPORT,
	DELIVERABLE_CATEGORY_UNIT_EXPORT,
	DELIVERABLE_UNIT_TABLE_EXPORT,
	DELIVERABLE_UNIT_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import { ApolloQueryResult } from "@apollo/client";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { FormattedMessage } from "react-intl";
import { DIALOG_TYPE } from "../../../models/constants";
import {
	IGeographiesBlock,
	IGeographiesBlockData,
} from "../../../models/geographies/geographiesBlock";
import GeographiesBlock from "../../Geographies/GeographiesBlock";
import { GEOGRAPHIES_ACTIONS } from "../../Geographies/constants";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	// {
	// 	valueAccessKey: "",
	// 	renderComponent: (deliverableUnit: IDeliverableUnitData) => (
	// 		<UnitsAndCategoriesProjectCount deliverableUnitId={deliverableUnit.id} />
	// 	),
	// },
	// { valueAccessKey: "" },
];

console.log("rows", rows);

const chipArray = ({
	arr,
	chipName,
	removeChip,
}: {
	arr: string[];
	removeChip: (index: number) => void;
	chipName: string;
}) => {
	return arr.map((element, index) => (
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
						<span>{chipName}</span>
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
			arr: [filterListObjectKeyValuePair[1]],
			chipName: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};

let deliverableUnitTableEditMenu: string[] = [];

function GeographiesBlockTableView({
	toggleDialogs,
	openDialogs,
	selectedGeographiesBlock,
	initialValues,
	geographiesBlocksList,
	// deliverableUnitList,
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
	geographiesBlockEditAccess,
	geographiesBlockFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	geographiesBlockDeleteAccess,
	geographiesBlockExportAccess,
	geographiesBlockImportFromCsvAccess,
}: {
	filterList: {
		[key: string]: string;
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	orderBy: string;
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	order: "asc" | "desc";
	loading: boolean;
	count: number;
	changePage: (prev?: boolean) => void;
	collapsableTable: boolean;
	geographiesBlocksList: IGeographiesBlockData[];
	// deliverableUnitList: IDeliverableUnitData[];
	initialValues: IGeographiesBlock;
	selectedGeographiesBlock: React.MutableRefObject<IGeographiesBlockData | null>;
	openDialogs: boolean[];
	toggleDialogs: (index: number, val: boolean) => void;
	geographiesBlockEditAccess: boolean;
	geographiesBlockFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	geographiesBlockDeleteAccess: boolean;
	geographiesBlockImportFromCsvAccess: boolean;
	geographiesBlockExportAccess: boolean;
}) {
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (geographiesBlockEditAccess) {
			deliverableUnitTableEditMenu[0] = "Edit Block";
			// deliverableUnitTableEditMenu[0] = "Edit Deliverable Unit";
		}
	}, [geographiesBlockEditAccess]);

	useEffect(() => {
		if (geographiesBlockDeleteAccess) {
			deliverableUnitTableEditMenu[1] = "Delete Block";
			// deliverableUnitTableEditMenu[1] = "Delete Deliverable Unit";
		}
	}, [geographiesBlockDeleteAccess]);

	const onDeliverableUnitTableRefetchSuccess = () => reftechDeliverableCategoryAndUnitTable();

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
	// 				inputFields={deliverableUnitInputFields}
	// 			/>
	// 		))) ||
	// 		(tableHeadings[tableHeadings.length - 1].renderComponent = undefined);
	// }

	const theme = useTheme();
	const { jwt } = useAuth();

	Object.entries(filterList).map((filterListObjectKeyValuePair) =>
		console.log("filterListObjectKeyValuePair", filterListObjectKeyValuePair)
	);

	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid xs={12} item>
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
					collapsableTable && geographiesBlockFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={geographiesBlocksList}
				// valuesList={deliverableUnitList}
				rows={rows}
				selectedRow={selectedGeographiesBlock}
				toggleDialogs={toggleDialogs}
				editMenuName={deliverableUnitTableEditMenu}
				collapsableTable={collapsableTable && geographiesBlockFindAccess}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Delivarable Unit"
						tableExportUrl={DELIVERABLE_UNIT_TABLE_EXPORT}
						tableImportUrl={DELIVERABLE_UNIT_TABLE_IMPORT}
						onImportTableSuccess={onDeliverableUnitTableRefetchSuccess}
						importButtonOnly={importButtonOnly}
						hideImport={!geographiesBlockImportFromCsvAccess}
						hideExport={!geographiesBlockExportAccess}
					>
						<>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1), float: "right" }}
								onClick={() =>
									exportTable({
										tableName: "Deliverable Unit Template",
										jwt: jwt as string,
										tableExportUrl: `${DELIVERABLE_UNIT_TABLE_EXPORT}?header=true`,
									})
								}
							>
								Geographies Block Template
								{/* Deliverable Unit Template */}
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			>
				<>
					<GeographiesBlock
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
					/>

					<GeographiesBlock
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
						dialogType={DIALOG_TYPE.DELETE}
					/>
				</>
				{/* {(rowData: { id: string }) => (
					<DeliverableCategory rowId={rowData.id} collapsableTable={false} />
				)} */}
			</CommonTable>
		</>
	);
}

export default GeographiesBlockTableView;
