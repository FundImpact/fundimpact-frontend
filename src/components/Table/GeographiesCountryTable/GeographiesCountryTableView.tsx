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
// import { ApolloQueryResult } from "@apollo/client";
import { exportTable } from "../../../utils/importExportTable.utils";
// import { FormattedMessage } from "react-intl";
import { useAuth } from "../../../contexts/userContext";
import { DIALOG_TYPE } from "../../../models/constants";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	// {
	// 	valueAccessKey: "",
	// 	renderComponent: (deliverableCategory: IDeliverableCategoryData) => (
	// 		<UnitsAndCategoriesProjectCount deliverableCategoryId={deliverableCategory.id} />
	// 	),
	// },
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
let deliverableCategoryTableEditMenu: string[] = [];

function GeographiesCountryTableView({
	toggleDialogs,
	openDialogs,
	selectedDeliverableCategory,
	initialValues,
	deliverableCategoryList,
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
	deliverableCategoryEditAccess,
	deliverableUnitFindAccess,
	reftechDeliverableCategoryAndUnitTable,
	deliverableCategoryDeleteAccess,
	deliverableCategoryExportAccess,
	deliverableCategoryImportFromCsvAccess,
}: {
	count: number;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedDeliverableCategory: React.MutableRefObject<IDeliverableCategoryData | null>;
	initialValues: IDeliverable;
	collapsableTable: boolean;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	changePage: (prev?: boolean) => void;
	deliverableCategoryList: IDeliverableCategoryData[];
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};

	removeFilterListElements: (key: string, index?: number | undefined) => void;
	deliverableCategoryEditAccess: boolean;
	deliverableUnitFindAccess: boolean;
	reftechDeliverableCategoryAndUnitTable: () => void;
	deliverableCategoryDeleteAccess: boolean;
	deliverableCategoryImportFromCsvAccess: boolean;
	deliverableCategoryExportAccess: boolean;
}) {
	useEffect(() => {
		if (deliverableCategoryEditAccess) {
			deliverableCategoryTableEditMenu[0] = "Edit Country";
		}
	}, [deliverableCategoryEditAccess]);

	useEffect(() => {
		if (deliverableCategoryDeleteAccess) {
			deliverableCategoryTableEditMenu[1] = "Delete Country";
		}
	}, [deliverableCategoryDeleteAccess]);

	// {
	// 	(!collapsableTable &&
	// 		(tableHeadings[tableHeadings.length - 1].renderComponent = () => (
	// 			<FilterList
	// 				initialValues={{
	// 					code: "",
	// 					name: "",
	// 					description: "",
	// 				}}
	// 				inputFields={deliverableCategoryInputFields}
	// 				setFilterList={setFilterList}
	// 			/>
	// 		))) ||
	// 		(tableHeadings[tableHeadings.length - 1].renderComponent = undefined);
	// }

	// console.log("tableHeadings.slice(1)", tableHeadings.slice(1));

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
				valuesList={deliverableCategoryList}
				rows={rows}
				selectedRow={selectedDeliverableCategory}
				toggleDialogs={toggleDialogs}
				editMenuName={deliverableCategoryTableEditMenu}
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
						hideImport={!deliverableCategoryImportFromCsvAccess}
						hideExport={!deliverableCategoryExportAccess}
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
					<Deliverable
						type={DELIVERABLE_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(0, false)}
						open={openDialogs[0]}
						data={initialValues}
					/>
					<Deliverable
						type={DELIVERABLE_ACTIONS.UPDATE}
						handleClose={() => toggleDialogs(1, false)}
						open={openDialogs[1]}
						data={initialValues}
						dialogType={DIALOG_TYPE.DELETE}
					/>
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
