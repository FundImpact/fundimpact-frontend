import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import {
	IGeographiesState,
	IGeographiesStateData,
} from "../../../models/geographies/geographiesState";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { GeographiesStateTableHeading as tableHeadings } from "../constants";
import { Grid, Box, Button, useTheme } from "@material-ui/core";
import {
	DELIVERABLE_UNIT_TABLE_EXPORT,
	DELIVERABLE_UNIT_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { DIALOG_TYPE } from "../../../models/constants";
import GeographiesState from "../../Geographies/GeographiesState";
import { GEOGRAPHIES_ACTIONS } from "../../Geographies/constants";
import ChipArray from "../../Chips";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "country" },
];

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

let geographiesStateTableEditMenu: string[] = [];

function GeographiesStateTableView({
	toggleDialogs,
	openDialogs,
	selectedGeographiesState,
	initialValues,
	geographiesStateList,
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
	geographiesStateEditAccess,
	geographiesStateFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	geographiesStateDeleteAccess,
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
	geographiesStateList: IGeographiesStateData[];
	initialValues: IGeographiesState;
	selectedGeographiesState: React.MutableRefObject<IGeographiesStateData | null>;
	openDialogs: boolean[];
	toggleDialogs: (index: number, val: boolean) => void;
	geographiesStateEditAccess: boolean;
	geographiesStateFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	geographiesStateDeleteAccess: boolean;
	deliverableUnitImportFromCsvAccess: boolean;
	deliverableUnitExportAccess: boolean;
}): JSX.Element {
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (geographiesStateEditAccess) {
			geographiesStateTableEditMenu[0] = "Edit State";
		}
	}, [geographiesStateEditAccess]);

	useEffect(() => {
		if (geographiesStateDeleteAccess) {
			geographiesStateTableEditMenu[1] = "Delete State";
		}
	}, [geographiesStateDeleteAccess]);

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
					collapsableTable && geographiesStateFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={geographiesStateList}
				rows={rows}
				selectedRow={selectedGeographiesState}
				toggleDialogs={toggleDialogs}
				editMenuName={geographiesStateTableEditMenu}
				collapsableTable={collapsableTable && geographiesStateFindAccess}
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
										tableName: "Geographies State Template",
										jwt: jwt as string,
										tableExportUrl: `${DELIVERABLE_UNIT_TABLE_EXPORT}?header=true`,
									})
								}
							>
								Geographies State Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
			>
				<>
					<GeographiesState
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
					/>
					<GeographiesState
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

export default GeographiesStateTableView;
