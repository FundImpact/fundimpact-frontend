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
	order,
	setOrder,
	orderBy,
	setOrderBy,
}: {
	deliverableCategoryList: IDeliverableCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
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
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
		/>
	);
}

export default DeliverableCategoryTableContainer;
