import React, { useState, useRef, useEffect, useMemo } from "react";
import DeliverableUnitView from "./DeliverableUnitView";
import { IGetImpactUnit } from "../../../models/impact/query";
import { IImpactUnitData } from "../../../models/impact/impact";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import {
	IDeliverableUnitData,
	IDeliverableUnit,
} from "../../../models/deliverable/deliverableUnit";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import { IDeliverableCategoryData, IDeliverable } from "../../../models/deliverable/deliverable";

const getInitialValues = (
	deliverableUnit: IDeliverableUnitData | null,
	organization: string | number,
	deliverableCategory: string[]
): IDeliverableUnit => {
	return {
		code: deliverableUnit?.code || "",
		description: deliverableUnit?.description || "",
		id: parseInt(deliverableUnit?.id || ""),
		name: deliverableUnit?.name || "",
		prefix_label: deliverableUnit?.prefix_label || "",
		suffix_label: deliverableUnit?.suffix_label || "",
		unit_type: deliverableUnit?.unit_type || "",
		deliverableCategory,
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
	const [
		getcategoryUnit,
		{ data: deliverableCategoryUnitList, loading: fetchingCategoryUnit },
	] = useLazyQuery(GET_CATEGORY_UNIT);

	useEffect(() => {
		if (selectedDeliverableUnit.current) {
			getcategoryUnit({
				variables: {
					filter: {
						deliverable_units_org: selectedDeliverableUnit.current.id,
					},
				},
			});
		}
	}, [getcategoryUnit, selectedDeliverableUnit.current]);

	const deliverableCategoryMemoized = useMemo<string[]>(
		() =>
			deliverableCategoryUnitList?.deliverableCategoryUnitList.map(
				(element: {
					deliverable_category_org: IDeliverableCategoryData;
					deliverable_units_org: IDeliverableUnitData;
				}) => element.deliverable_category_org.id
			),
		[deliverableCategoryUnitList]
	);

	return (
		<DeliverableUnitView
			openDialog={openDialog}
			setOpenDialog={setOpenDialog}
			selectedDeliverableUnit={selectedDeliverableUnit}
			initialValues={getInitialValues(
				selectedDeliverableUnit.current,
				dashboardData?.organization?.id || "",
				deliverableCategoryMemoized || []
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
