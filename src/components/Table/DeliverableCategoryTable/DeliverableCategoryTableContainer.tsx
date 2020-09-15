import React, { useState, useRef } from "react";
import DeliverableCategoryTableView from "./DeliverableCategoryTableView";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";
import { useDashBoardData } from "../../../contexts/dashboardContext";

const getInitialValues = (
	deliverableCategory: IDeliverableCategoryData | null,
	organization?: string
): IDeliverable => {
	return {
		code: deliverableCategory?.code || "",
		description: deliverableCategory?.description || "",
		id: parseInt(deliverableCategory?.id || ""),
		name: deliverableCategory?.name || "",
		organization,
	};
};

function DeliverableCategoryTableContainer({
	deliverableCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	deliverableCategoryList: IDeliverableCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const selectedDeliverableCategory = useRef<IDeliverableCategoryData | null>(null);

	const dashboardData = useDashBoardData();

	return (
		<DeliverableCategoryTableView
			openDialog={openDialog}
			setOpenDialog={setOpenDialog}
			selectedDeliverableCategory={selectedDeliverableCategory}
			initialValues={getInitialValues(
				selectedDeliverableCategory.current,
				dashboardData?.organization?.id || ""
			)}
			deliverableCategoryList={deliverableCategoryList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		/>
	);
}

export default DeliverableCategoryTableContainer;
