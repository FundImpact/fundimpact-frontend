import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GeographiesDistrictTableHeading as tableHeadings } from "../constants";
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
	IGeographiesDistrict,
	IGeographiesDistrictData,
} from "../../../models/geographies/geographiesDistrict";
import GeographiesDistrict from "../../Geographies/GeographiesDistrict";
import { GEOGRAPHIES_ACTIONS } from "../../Geographies/constants";
import ChipArray from "../../Chips";

const rows = [{ valueAccessKey: "name" }, { valueAccessKey: "code" }, { valueAccessKey: "state" }];

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
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChips: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};

let geographiesDistrictTableEditMenu: string[] = [];

function GeographiesDistrictTableView({
	toggleDialogs,
	openDialogs,
	selectedGeographiesDistrict,
	initialValues,
	geographiesDistrictList,
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
	geographiesDistrictEditAccess,
	geographiesDistrictFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	geographiesDistrictDeleteAccess,
	deliverableUnitExportAccess,
	deliverableUnitImportFromCsvAccess,
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
	geographiesDistrictList: IGeographiesDistrictData[];
	initialValues: IGeographiesDistrict;
	selectedGeographiesDistrict: React.MutableRefObject<IGeographiesDistrictData | null>;
	openDialogs: boolean[];
	toggleDialogs: (index: number, val: boolean) => void;
	geographiesDistrictEditAccess: boolean;
	geographiesDistrictFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	geographiesDistrictDeleteAccess: boolean;
	deliverableUnitImportFromCsvAccess: boolean;
	deliverableUnitExportAccess: boolean;
}) {
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (geographiesDistrictEditAccess) {
			geographiesDistrictTableEditMenu[0] = "Edit Distrct";
		}
	}, [geographiesDistrictEditAccess]);

	useEffect(() => {
		if (geographiesDistrictDeleteAccess) {
			geographiesDistrictTableEditMenu[1] = "Delete District";
		}
	}, [geographiesDistrictDeleteAccess]);

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
					collapsableTable && geographiesDistrictFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={geographiesDistrictList}
				rows={rows}
				selectedRow={selectedGeographiesDistrict}
				toggleDialogs={toggleDialogs}
				editMenuName={geographiesDistrictTableEditMenu}
				collapsableTable={collapsableTable && geographiesDistrictFindAccess}
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
						hideImport={!deliverableUnitImportFromCsvAccess}
						hideExport={!deliverableUnitExportAccess}
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
								Geographies District Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			>
				<>
					<GeographiesDistrict
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
					/>
					<GeographiesDistrict
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

export default GeographiesDistrictTableView;
