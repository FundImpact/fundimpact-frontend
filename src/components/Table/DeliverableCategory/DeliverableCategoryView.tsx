import React, { useEffect } from "react";
import CommonTable from "../CommonTable";
import BudgetCategory from "../../Budget/BudgetCategory";
import { FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactCategoryData } from "../../../models/impact/impact";
import { IGetImpactCategory } from "../../../models/impact/query";
import AmountSpent from "../Budget/BudgetTargetTable/AmountSpent";
import ImpactUnit from "../ImpactUnit";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";
import Deliverable from "../../Deliverable/Deliverable";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import DeliverableUnit from "../DeliverableUnit";
import { Typography, Box } from "@material-ui/core";

//try to shift it to constants
const tableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Deliverable Category" },
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

function DeliverableCategoryView({
	setOpenDialog,
	openDialog,
	selectedDeliverableCategory,
	initialValues,
	deliverableCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
	openDialog: boolean;
	selectedDeliverableCategory: React.MutableRefObject<IDeliverableCategoryData | null>;
	initialValues: IDeliverable;
	deliverableCategoryList: IDeliverableCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	return (
		<CommonTable
			tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
			valuesList={deliverableCategoryList}
			rows={rows}
			selectedRow={selectedDeliverableCategory}
			setOpenDialog={setOpenDialog}
			editMenuName={"Edit Deliverable Category"}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		>
			<Deliverable
				type={DELIVERABLE_ACTIONS.UPDATE}
				handleClose={() => setOpenDialog(false)}
				open={openDialog}
				data={initialValues}
			/>

			<DeliverableUnit collapsableTable={false} />
		</CommonTable>
	);
}

export default DeliverableCategoryView;
