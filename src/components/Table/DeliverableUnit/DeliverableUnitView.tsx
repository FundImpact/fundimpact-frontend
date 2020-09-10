import React from "react";
import CommonTable from "../CommonTable";
import BudgetCategory from "../../Budget/BudgetCategory";
import { FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactUnitData } from "../../../models/impact/impact";
import { IGetImpactUnit } from "../../../models/impact/query";
import AmountSpent from "../Budget/BudgetTargetTable/AmountSpent";
import ImpactUnitDialog from "../../Impact/ImpactUnitDialog/ImpaceUnitDialog";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import ImpactCategory from "../ImpactCategory";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import DeliverableUnit from "../../Deliverable/DeliverableUnit";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import DeliverableCategory from "../DeliverableCategory";
import { Typography, Box } from "@material-ui/core";

//try to shift it to constants
const tableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Deliverable Unit" },
	{ label: "Code" },
	{ label: "Description" },
	{ label: "" },
	{ label: "" },
];

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{ valueAccessKey: "" },
];

function DeliverableUnitView({
	setOpenDialog,
	openDialog,
	selectedDeliverableUnit,
	initialValues,
	deliverableUnitList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
	openDialog: boolean;
	selectedDeliverableUnit: React.MutableRefObject<IDeliverableUnitData | null>;
	initialValues: IDeliverableUnit;
	deliverableUnitList: IDeliverableUnitData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	const dashboardData = useDashBoardData();
	return (
		<CommonTable
			tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
			valuesList={deliverableUnitList}
			rows={rows}
			selectedRow={selectedDeliverableUnit}
			setOpenDialog={setOpenDialog}
			editMenuName={"Edit Deliverable Unit"}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		>
			<DeliverableUnit
				type={DELIVERABLE_ACTIONS.UPDATE}
				handleClose={() => setOpenDialog(false)}
				open={openDialog}
				data={initialValues}
				organization={dashboardData?.organization?.id || ""}
			/>

			<DeliverableCategory collapsableTable={false} />
		</CommonTable>
	);
}

export default DeliverableUnitView;
