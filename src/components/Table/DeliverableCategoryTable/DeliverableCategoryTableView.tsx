import React from "react";
import CommonTable from "../CommonTable";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";
import Deliverable from "../../Deliverable/Deliverable";
import { DELIVERABLE_ACTIONS } from "../../Deliverable/constants";
import DeliverableUnitTable from "../DeliverableUnitTable";
import { deliverableCategoryTableHeading as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (id: string) => (
			<UnitsAndCategoriesProjectCount deliverableCategoryId={id} />
		),
	},
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

			<DeliverableUnitTable collapsableTable={false} />
		</CommonTable>
	);
}

export default DeliverableCategoryView;
