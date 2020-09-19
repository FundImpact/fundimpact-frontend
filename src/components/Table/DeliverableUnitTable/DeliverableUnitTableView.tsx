import React from "react";
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
	name,
	removeChip,
}: {
	arr: string[];
	name: string;
	removeChip: (index: number) => void;
}) => {
	return arr.map((element, index) => (
		<Box key={index} mx={1}>
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
}: {
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	selectedDeliverableUnit: React.MutableRefObject<IDeliverableUnitData | null>;
	initialValues: IDeliverableUnit;
	deliverableUnitList: IDeliverableUnitData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) {
	console.log("openDialogs :>> ", openDialogs);
	const dashboardData = useDashBoardData();
	return (
		<>
			{!collapsableTable && (
				<Grid container>
					<Grid item xs={11}>
						<Box my={2} display="flex">
							{Object.entries(filterList).map((element) => {
								if (element[1] && typeof element[1] == "string") {
									return chipArray({
										arr: [element[1]],
										name: element[0].slice(0, 4),
										removeChip: (index: number) => {
											removeFilterListElements(element[0]);
										},
									});
								}
							})}
						</Box>
					</Grid>
					<Grid item xs={1}>
						<Box mt={2}>
							<FilterList
								initialValues={{
									name: "",
									code: "",
									description: "",
								}}
								setFilterList={setFilterList}
								inputFields={deliverableUnitInputFields}
							/>
						</Box>
					</Grid>
				</Grid>
			)}
			<CommonTable
				tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
				valuesList={deliverableUnitList}
				rows={rows}
				selectedRow={selectedDeliverableUnit}
				toggleDialogs={toggleDialogs}
				editMenuName={["Edit Deliverable Unit"]}
				collapsableTable={collapsableTable}
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
