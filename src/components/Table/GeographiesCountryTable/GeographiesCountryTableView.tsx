import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { GeographiesCountryTableHeading as tableHeadings } from "../constants";
import { Grid, Box, Chip, Avatar, Button, useTheme } from "@material-ui/core";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import {
	DELIVERABLE_CATEGORY_TABLE_EXPORT,
	DELIVERABLE_CATEGORY_TABLE_IMPORT,
	// DELIVERABLE_CATEGORY_UNIT_EXPORT,
} from "../../../utils/endpoints.util";
import { exportTable } from "../../../utils/importExportTable.utils";
import { useAuth } from "../../../contexts/userContext";
import { DIALOG_TYPE } from "../../../models/constants";
import { IGeographies, IGeographiesCountryData } from "../../../models/geographies/geographies";
import { GEOGRAPHIES_ACTIONS } from "../../Geographies/constants";
import Geographies from "../../Geographies/Geographies";
import ChipArray from "../../Chips";

const rows = [{ valueAccessKey: "name" }, { valueAccessKey: "code" }];

const chipArr = ({
	list,
	name,
	removeChip,
}: {
	list: string[];
	name: string;
	removeChip: (index: number) => void;
}) => {
	return list.map((element, index) => (
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
	removeFilterListElements,
	filterListObjectKeyValuePair,
}: {
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	filterListObjectKeyValuePair: any;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return ChipArray({
			arr: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0],
			removeChips: () => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}
	return null;
};
let geographiesCountryTableEditMenu: string[] = [];

function GeographiesCountryTableView({
	toggleDialogs,
	openDialogs,
	selectedGeographiesCountry,
	initialValues,
	geographiesCountryList,
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
	geographiesCountryEditAccess,
	deliverableUnitFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	geographiesCountryDeleteAccess,
	geographiesCountryExportAccess,
	geographiesCountryImportFromCsvAccess,
}: {
	count: number;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedGeographiesCountry: React.MutableRefObject<IGeographiesCountryData | null>;
	initialValues: IGeographies;
	collapsableTable: boolean;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	changePage: (prev?: boolean) => void;
	geographiesCountryList: IGeographiesCountryData[];
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	geographiesCountryEditAccess: boolean;
	deliverableUnitFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	geographiesCountryDeleteAccess: boolean;
	geographiesCountryImportFromCsvAccess: boolean;
	geographiesCountryExportAccess: boolean;
}) {
	useEffect(() => {
		if (geographiesCountryEditAccess) {
			geographiesCountryTableEditMenu[0] = "Edit Country";
		}
	}, [geographiesCountryEditAccess]);

	useEffect(() => {
		if (geographiesCountryDeleteAccess) {
			geographiesCountryTableEditMenu[1] = "Delete Country";
		}
	}, [geographiesCountryDeleteAccess]);

	const onDeliverableCategoryTableImportSuccess = () => reftechDeliverableCategoryAndUnitTable();

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
					collapsableTable && deliverableUnitFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={geographiesCountryList}
				rows={rows}
				selectedRow={selectedGeographiesCountry}
				toggleDialogs={toggleDialogs}
				editMenuName={geographiesCountryTableEditMenu}
				collapsableTable={collapsableTable && deliverableUnitFindAccess}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Delivarable Category"
						tableExportUrl={DELIVERABLE_CATEGORY_TABLE_EXPORT}
						tableImportUrl={DELIVERABLE_CATEGORY_TABLE_IMPORT}
						onImportTableSuccess={onDeliverableCategoryTableImportSuccess}
						importButtonOnly={importButtonOnly}
						hideImport={!geographiesCountryImportFromCsvAccess}
						hideExport={!geographiesCountryExportAccess}
					>
						<Button
							variant="outlined"
							style={{ marginRight: theme.spacing(1), float: "right" }}
							onClick={() =>
								exportTable({
									tableName: "Geographies Country Template",
									jwt: jwt as string,
									tableExportUrl: `${DELIVERABLE_CATEGORY_TABLE_EXPORT}?header=true`,
								})
							}
						>
							Geographies Country Template
						</Button>
					</ImportExportTableMenu>
				)}
			>
				<>
					<Geographies
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
					/>
					<Geographies
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
						dialogType={DIALOG_TYPE.DELETE}
					/>
				</>
			</CommonTable>
		</>
	);
}

export default GeographiesCountryTableView;
