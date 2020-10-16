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
import { deliverableUnitTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";
import { Grid, Box, Chip, Avatar } from "@material-ui/core";
import FilterList from "../../FilterList";
import { deliverableUnitInputFields } from "../../../pages/settings/DeliverableMaster/inputFields.json";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (deliverableUnit: IDeliverableUnitData) => (
			<UnitsAndCategoriesProjectCount deliverableUnitId={deliverableUnit.id} />
		),
	},
	{ valueAccessKey: "" },
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

let deliverableUnitTableEditMenu: string[] = [];

function DeliverableUnitTableView({
	toggleDialogs,
	openDialogs,
	selectedDeliverableUnit,
	initialValues,
	deliverableUnitList,
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
	deliverableUnitEditAccess,
	deliverableCategoryFindAccess,
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
	deliverableUnitList: IDeliverableUnitData[];
	initialValues: IDeliverableUnit;
	selectedDeliverableUnit: React.MutableRefObject<IDeliverableUnitData | null>;
	openDialogs: boolean[];
	toggleDialogs: (index: number, val: boolean) => void;
	deliverableUnitEditAccess: boolean;
	deliverableCategoryFindAccess: boolean;
}) {
	const dashboardData = useDashBoardData();

	useEffect(() => {
		if (deliverableUnitEditAccess) {
			deliverableUnitTableEditMenu = ["Edit Deliverable Unit"];
		}
	}, [deliverableUnitEditAccess]);

	{
		(!collapsableTable &&
			(tableHeadings[tableHeadings.length - 1].renderComponent = () => (
				<FilterList
					initialValues={{
						name: "",
						code: "",
						description: "",
					}}
					setFilterList={setFilterList}
					inputFields={deliverableUnitInputFields}
				/>
			))) ||
			(tableHeadings[tableHeadings.length - 1].renderComponent = undefined);
	}

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
					collapsableTable && deliverableCategoryFindAccess
						? tableHeadings
						: tableHeadings.slice(1)
				}
				valuesList={deliverableUnitList}
				rows={rows}
				selectedRow={selectedDeliverableUnit}
				toggleDialogs={toggleDialogs}
				editMenuName={deliverableUnitTableEditMenu}
				collapsableTable={collapsableTable && deliverableCategoryFindAccess}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			>
				<DeliverableUnit
					type={DELIVERABLE_ACTIONS.UPDATE}
					handleClose={() => toggleDialogs(0, false)}
					open={openDialogs[0]}
					data={initialValues}
					organization={dashboardData?.organization?.id || ""}
				/>
				{(rowData: { id: string }) => (
					<DeliverableCategory rowId={rowData.id} collapsableTable={false} />
				)}
			</CommonTable>
		</>
	);
}

export default DeliverableUnitTableView;
