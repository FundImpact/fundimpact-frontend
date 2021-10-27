import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";
import Deliverable from "../../Deliverable/Deliverable";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
// import DeliverableUnitTable from "../DeliverableUnitTable";
import { GeographiesCountryTableHeading as tableHeadings } from "../constants";
// import { deliverableCategoryTableHeading as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { Grid, Box, Chip, Avatar, Button, useTheme } from "@material-ui/core";
// import FilterList from "../../FilterList";
// import { deliverableCategoryInputFields } from "../../../pages/settings/DeliverableMaster/inputFields.json";
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

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	// { valueAccessKey: "description" },
	// { valueAccessKey: "" },
];

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
		return chipArr({
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
			list: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
		});
	}
	return null;
};
// let deliverableCategoryTableEditMenu: string[] = [];
let geographiesCountryTableEditMenu: string[] = [];

console.log("geographiesCountryTableEditMenu", geographiesCountryTableEditMenu);

function GeographiesCountryTableView({
	toggleDialogs,
	openDialogs,
	// selectedDeliverableCategory,
	selectedGeographiesCountry,
	initialValues,
	geographiesCountryList,
	// deliverableCategoryList,
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
	// deliverableCategoryEditAccess,
	deliverableUnitFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	// deliverableCategoryDeleteAccess,
	geographiesCountryDeleteAccess,
	geographiesCountryExportAccess,
	// deliverableCategoryExportAccess,
	geographiesCountryImportFromCsvAccess,
}: // deliverableCategoryImportFromCsvAccess,
{
	count: number;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedGeographiesCountry: React.MutableRefObject<IGeographiesCountryData | null>;
	// selectedDeliverableCategory: React.MutableRefObject<IDeliverableCategoryData | null>;
	initialValues: IGeographies;
	// initialValues: IDeliverable;
	collapsableTable: boolean;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	changePage: (prev?: boolean) => void;
	geographiesCountryList: IGeographiesCountryData[];
	// deliverableCategoryList: IDeliverableCategoryData[];
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	// deliverableCategoryEditAccess: boolean;
	geographiesCountryEditAccess: boolean;
	deliverableUnitFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	geographiesCountryDeleteAccess: boolean;
	// deliverableCategoryDeleteAccess: boolean;
	geographiesCountryImportFromCsvAccess: boolean;
	// deliverableCategoryImportFromCsvAccess: boolean;
	geographiesCountryExportAccess: boolean;
	// deliverableCategoryExportAccess: boolean;
}) {
	console.log(
		"geographiesCountryEditAccess",
		geographiesCountryEditAccess,
		geographiesCountryDeleteAccess
	);

	useEffect(() => {
		if (geographiesCountryEditAccess) {
			// if (deliverableCategoryEditAccess) {
			geographiesCountryTableEditMenu[0] = "Edit Country";
			// deliverableCategoryTableEditMenu[0] = "Edit Country";
		}
	}, [geographiesCountryEditAccess]);
	// }, [deliverableCategoryEditAccess]);

	useEffect(() => {
		if (geographiesCountryDeleteAccess) {
			// if (deliverableCategoryDeleteAccess) {
			geographiesCountryTableEditMenu[1] = "Delete Country";
			// deliverableCategoryTableEditMenu[1] = "Delete Country";
		}
	}, [geographiesCountryDeleteAccess]);
	// }, [deliverableCategoryDeleteAccess]);

	console.log("country initials", initialValues);

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
				// selectedRow={selectedDeliverableCategory}
				toggleDialogs={toggleDialogs}
				editMenuName={geographiesCountryTableEditMenu}
				// editMenuName={deliverableCategoryTableEditMenu}
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
						// hideImport={!deliverableCategoryImportFromCsvAccess}
						hideExport={!geographiesCountryExportAccess}
						// hideExport={!deliverableCategoryExportAccess}
					>
						<Button
							variant="outlined"
							style={{ marginRight: theme.spacing(1), float: "right" }}
							onClick={() =>
								exportTable({
									tableName: "Deliverable Category Template",
									jwt: jwt as string,
									tableExportUrl: `${DELIVERABLE_CATEGORY_TABLE_EXPORT}?header=true`,
								})
							}
						>
							Geographies Country Template
							{/* Deliverable Category Template */}
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
					{/* <Deliverable
						type={DELIVERABLE_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
					/> */}
					<Geographies
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
						dialogType={DIALOG_TYPE.DELETE}
					/>
					{/* <Deliverable
						type={DELIVERABLE_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						data={initialValues}
						dialogType={DIALOG_TYPE.DELETE}
					/> */}
				</>
				{/* {(rowData: { id: string }) => (
					<>
						<DeliverableUnitTable rowId={rowData.id} collapsableTable={false} />
					</>
				)} */}
			</CommonTable>
		</>
	);
}

export default GeographiesCountryTableView;

// deliverableCategoryList in common Table in change of geographiesCountryList
