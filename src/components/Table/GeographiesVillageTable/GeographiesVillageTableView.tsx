import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GeographiesVillageTableHeading as tableHeadings } from "../constants";
import { Grid, Box, Button, useTheme } from "@material-ui/core";
import {
	DELIVERABLE_UNIT_TABLE_EXPORT,
	DELIVERABLE_UNIT_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { DIALOG_TYPE } from "../../../models/constants";
import {
	IGeographiesVillage,
	IGeographiesVillageData,
} from "../../../models/geographies/geographiesVillage";
import GeographiesVillage from "../../Geographies/GeographiesVillage";
import { GEOGRAPHIES_ACTIONS } from "../../Geographies/constants";
import ChipArray from "../../Chips";

const rows = [{ valueAccessKey: "name" }, { valueAccessKey: "code" }, { valueAccessKey: "block" }];

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return ChipArray({
			arr: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].split(0, 4),
			removeChips: () => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};

let geographiesVillageTableEditMenu: string[] = [];

function GeographiesVillageTableView({
	toggleDialogs,
	openDialogs,
	selectedGeographiesVillage,
	initialValues,
	geographiesVillageList,
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
	geographiesVillageEditAccess,
	geographiesVillageFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	geographiesVillageDeleteAccess,
	GeographiesVillageExportAccess,
	geographiesVillageImportFromCsvAccess,
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
	geographiesVillageList: IGeographiesVillageData[];
	initialValues: IGeographiesVillage;
	selectedGeographiesVillage: React.MutableRefObject<IGeographiesVillageData | null>;
	openDialogs: boolean[];
	toggleDialogs: (index: number, val: boolean) => void;
	geographiesVillageEditAccess: boolean;
	geographiesVillageFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	geographiesVillageDeleteAccess: boolean;
	geographiesVillageImportFromCsvAccess: boolean;
	GeographiesVillageExportAccess: boolean;
}) {
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (geographiesVillageEditAccess) {
			geographiesVillageTableEditMenu[0] = "Edit Village";
		}
	}, [geographiesVillageEditAccess]);

	useEffect(() => {
		if (geographiesVillageDeleteAccess) {
			geographiesVillageTableEditMenu[1] = "Delete Village";
		}
	}, [geographiesVillageDeleteAccess]);

	const onDeliverableUnitTableRefetchSuccess = () => reftechDeliverableCategoryAndUnitTable();

	const theme = useTheme();
	const { jwt } = useAuth();

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
					collapsableTable && geographiesVillageFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={geographiesVillageList}
				rows={rows}
				selectedRow={selectedGeographiesVillage}
				toggleDialogs={toggleDialogs}
				editMenuName={geographiesVillageTableEditMenu}
				collapsableTable={collapsableTable && geographiesVillageFindAccess}
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
						hideImport={!geographiesVillageImportFromCsvAccess}
						hideExport={!GeographiesVillageExportAccess}
					>
						<>
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1), float: "right" }}
								onClick={() =>
									exportTable({
										tableName: "Geographies Village Template",
										jwt: jwt as string,
										tableExportUrl: `${DELIVERABLE_UNIT_TABLE_EXPORT}?header=true`,
									})
								}
							>
								Geographies village Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			>
				<>
					<GeographiesVillage
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
					/>
					<GeographiesVillage
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
						dialogType={DIALOG_TYPE.DELETE}
					/>
				</>
			</CommonTable>
		</>
	);
}

export default GeographiesVillageTableView;
