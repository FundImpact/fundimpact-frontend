import React, { useState, useRef } from "react";
import DeliverableUnitView from "./DeliverableUnitView";
import { IGetImpactUnit } from "../../../models/impact/query";
import { IImpactUnitData } from "../../../models/impact/impact";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import { useDashBoardData } from "../../../contexts/dashboardContext";

const getInitialValues = (
	deliverableUnit: IDeliverableUnitData | null,
	organization: string | number
): IDeliverableUnit => {
	return {
		code: deliverableUnit?.code || "",
		description: deliverableUnit?.description || "",
		id: parseInt(deliverableUnit?.id || ""),
		name: deliverableUnit?.name || "",
		prefix_label: deliverableUnit?.prefix_label || "",
		suffix_label: deliverableUnit?.suffix_label || "",
		unit_type: deliverableUnit?.unit_type || "",
		deliverableCategory: "",
		organization,
	};
};

function DeliverableUnitContainer({
	deliverableUnitList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	deliverableUnitList: IDeliverableUnitData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const selectedDeliverableUnit = useRef<IDeliverableUnitData | null>(null);
	const dashboardData = useDashBoardData();
	return (
		<DeliverableUnitView
			openDialog={openDialog}
			setOpenDialog={setOpenDialog}
			selectedDeliverableUnit={selectedDeliverableUnit}
			initialValues={getInitialValues(
				selectedDeliverableUnit.current,
				dashboardData?.organization?.id || ""
			)}
			deliverableUnitList={deliverableUnitList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		/>
	);
}

export default DeliverableUnitContainer;
