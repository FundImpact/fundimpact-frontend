import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import { IGeographiesState } from "../../../models/geographies/geographiesState";
import DeliverableUnit from "../../Deliverable/DeliverableUnit";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import DeliverableCategory from "../DeliverableCategoryTable";
import { GeographiesStateTableHeading as tableHeadings } from "../constants";
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
import { IGeographiesStateData } from "../../../models/geographies/geographiesState";
import GeographiesState from "../../Geographies/GeographiesState";
import { GEOGRAPHIES_ACTIONS } from "../../Geographies/constants";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "country" },
	// { valueAccessKey: "description" },
	// {
	// 	valueAccessKey: "",
	// 	renderComponent: (deliverableUnit: IDeliverableUnitData) => (
	// 		<UnitsAndCategoriesProjectCount deliverableUnitId={deliverableUnit.id} />
	// 	),
	// },
	// { valueAccessKey: "" },
];

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

let geographiesStateTableEditMenu: string[] = [];
// let deliverableUnitTableEditMenu: string[] = [];

function GeographiesStateTableView({
	toggleDialogs,
	openDialogs,
	selectedGeographiesState,
	// selectedDeliverableUnit,
	initialValues,
	geographiesStateList,
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
	geographiesStateEditAccess,
	// deliverableUnitEditAccess,
	geographiesStateFindAccess,
	// deliverableCategoryFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	geographiesStateDeleteAccess,
	// deliverableUnitDeleteAccess,
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
	// deliverableUnitList: IDeliverableUnitData[];
	initialValues: IGeographiesState;
	// initialValues: IDeliverableUnit;
	selectedGeographiesState: React.MutableRefObject<IGeographiesStateData | null>;
	// selectedDeliverableUnit: React.MutableRefObject<IDeliverableUnitData | null>;
	openDialogs: boolean[];
	toggleDialogs: (index: number, val: boolean) => void;
	geographiesStateEditAccess: boolean;
	// deliverableUnitEditAccess: boolean;
	geographiesStateFindAccess: boolean;
	// deliverableCategoryFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	geographiesStateDeleteAccess: boolean;
	// deliverableUnitDeleteAccess: boolean;
	deliverableUnitImportFromCsvAccess: boolean;
	deliverableUnitExportAccess: boolean;
}): JSX.Element {
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (geographiesStateEditAccess) {
			// if (deliverableUnitEditAccess) {
			geographiesStateTableEditMenu[0] = "Edit State";
			// deliverableUnitTableEditMenu[0] = "Edit Deliverable Unit";
		}
	}, [geographiesStateEditAccess]);
	// }, [deliverableUnitEditAccess]);

	useEffect(() => {
		if (geographiesStateDeleteAccess) {
			// if (deliverableUnitDeleteAccess) {
			geographiesStateTableEditMenu[1] = "Delete State";
			// deliverableUnitTableEditMenu[1] = "Delete Deliverable Unit";
		}
	}, [geographiesStateDeleteAccess]);
	// }, [deliverableUnitDeleteAccess]);

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
					collapsableTable && geographiesStateFindAccess
						? // collapsableTable && deliverableCategoryFindAccess
						  tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={geographiesStateList}
				// valuesList={deliverableUnitList}
				rows={rows}
				selectedRow={selectedGeographiesState}
				// selectedRow={selectedDeliverableUnit}
				toggleDialogs={toggleDialogs}
				editMenuName={geographiesStateTableEditMenu}
				// editMenuName={deliverableUnitTableEditMenu}
				collapsableTable={collapsableTable && geographiesStateFindAccess}
				// collapsableTable={collapsableTable && deliverableCategoryFindAccess}
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
								{/* Deliverable Unit Template */}
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
					{/* <DeliverableUnit
						type={DELIVERABLE_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
					/> */}
					<GeographiesState
						type={GEOGRAPHIES_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
						dialogType={DIALOG_TYPE.DELETE}
					/>
					{/* <DeliverableUnit
						type={DELIVERABLE_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						data={initialValues}
						organization={dashboardData?.organization?.id || ""}
						dialogType={DIALOG_TYPE.DELETE}
					/> */}
				</>
				{/* {(rowData: { id: string }) => (
					<DeliverableCategory rowId={rowData.id} collapsableTable={false} />
				)} */}
			</CommonTable>
		</>
	);
}

export default GeographiesStateTableView;
