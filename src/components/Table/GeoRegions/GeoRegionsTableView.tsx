import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { geoRegionsHeading as tableHeadings } from "../constants";
import { DIALOG_TYPE, FORM_ACTIONS } from "../../../models/constants";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { BUDGET_CATEGORY_ACTIONS } from "../../../utils/access/modules/budgetCategory/actions";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	BUDGET_CATEGORY_TABLE_EXPORT,
	BUDGET_CATEGORY_TABLE_IMPORT,
} from "../../../utils/endpoints.util";
import { Button, useTheme } from "@material-ui/core";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import GeoRegions from "../../GeoRegions";
import { IGeoRegions } from "../../../models/GeoRegions";

const rows = [{ valueAccessKey: "name" }, { valueAccessKey: "description" }];

let geoRegionsTableEditMenu: string[] = [];

function GeoRegionsTableView({
	toggleDialogs,
	openDialogs,
	selectedGeoRegions,
	initialValues,
	geoRegionsList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	geoRegionsTableRefetch,
}: {
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedGeoRegions: React.MutableRefObject<Required<IGeoRegions> | null>;
	initialValues: Required<IGeoRegions>;
	geoRegionsList: Required<IGeoRegions>[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	geoRegionsTableRefetch: () => void;
}) {
	const geoRegionsEditAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.UPDATE_BUDGET_CATEGORY
	);

	const geoRegionsDeleteAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.DELETE_BUDGET_CATEGORY
	);
	const geoRegionsImportFromCsvAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_IMPORT_FROM_CSV
	);

	const geoRegionsExportAccess = userHasAccess(
		MODULE_CODES.BUDGET_CATEGORY,
		BUDGET_CATEGORY_ACTIONS.BUDGET_CATEGORY_EXPORT
	);

	const onImportTableSuccess = () => geoRegionsTableRefetch && geoRegionsTableRefetch();

	useEffect(() => {
		if (geoRegionsEditAccess) {
			geoRegionsTableEditMenu[0] = "Edit Geo Regions";
		}
	}, [geoRegionsEditAccess]);

	useEffect(() => {
		if (geoRegionsDeleteAccess) {
			geoRegionsTableEditMenu[1] = "Delete Geo Regions";
		}
	}, [geoRegionsDeleteAccess]);

	const theme = useTheme();
	const { jwt } = useAuth();

	return (
		<CommonTable
			tableHeadings={tableHeadings}
			valuesList={geoRegionsList}
			rows={rows}
			selectedRow={selectedGeoRegions}
			toggleDialogs={toggleDialogs}
			editMenuName={geoRegionsTableEditMenu}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
				<ImportExportTableMenu
					tableName="Budget Category "
					tableExportUrl={BUDGET_CATEGORY_TABLE_EXPORT}
					tableImportUrl={BUDGET_CATEGORY_TABLE_IMPORT}
					onImportTableSuccess={onImportTableSuccess}
					importButtonOnly={importButtonOnly}
					hideImport={!geoRegionsImportFromCsvAccess}
					hideExport={!geoRegionsExportAccess}
				>
					<Button
						variant="outlined"
						style={{ marginRight: theme.spacing(1), float: "right" }}
						onClick={() =>
							exportTable({
								tableName: "Geo Regions Template",
								jwt: jwt as string,
								tableExportUrl: `${BUDGET_CATEGORY_TABLE_EXPORT}?header=true`,
							})
						}
					>
						Geo Regions Template
					</Button>
				</ImportExportTableMenu>
			)}
		>
			<>
				<GeoRegions
					formAction={FORM_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(0, false)}
					open={openDialogs[0]}
					initialValues={initialValues}
				/>
				<GeoRegions
					formAction={FORM_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(1, false)}
					open={openDialogs[1]}
					initialValues={initialValues}
					dialogType={DIALOG_TYPE.DELETE}
				/>
			</>
		</CommonTable>
	);
}

export default GeoRegionsTableView;
