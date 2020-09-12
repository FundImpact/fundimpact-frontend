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

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (id: string) => <UnitsAndCategoriesProjectCount deliverableUnitId={id} />,
	},
	{ valueAccessKey: "" },
];

function DeliverableUnitTableView({
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

export default DeliverableUnitTableView;
