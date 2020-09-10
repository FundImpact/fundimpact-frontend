import React, { useState, useRef, useEffect, useMemo } from "react";
import ImpactUnitView from "./ImpactUnitView";
import { IGetImpactUnit } from "../../../models/impact/query";
import { IImpactUnitData, IImpactCategoryData } from "../../../models/impact/impact";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import { GET_IMPACT_CATEGORY_UNIT } from "../../../graphql/Impact/categoryUnit";
import { useLazyQuery } from "@apollo/client";

const getInitialValues = (
	impactUnit: IImpactUnitData | null,
	impactCategory: string[]
): IImpactUnitFormInput => {
	return {
		code: impactUnit?.code || "",
		description: impactUnit?.description || "",
		id: impactUnit?.id || "",
		name: impactUnit?.name || "",
		target_unit: impactUnit?.target_unit + "" || "",
		prefix_label: impactUnit?.prefix_label || "",
		suffix_label: impactUnit?.suffix_label || "",
		impactCategory,
	};
};

function ImpactUnitContainer({
	impactUnitList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	impactUnitList: IImpactUnitData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const selectedImpactUnit = useRef<IImpactUnitData | null>(null);
	const [getImpactCategoryUnit, { data: impactCategoryUnitList }] = useLazyQuery(
		GET_IMPACT_CATEGORY_UNIT
	);

	useEffect(() => {
		if (selectedImpactUnit.current) {
			getImpactCategoryUnit({
				variables: {
					filter: {
						impact_units_org: selectedImpactUnit.current.id,
					},
				},
			});
		}
	}, [getImpactCategoryUnit, selectedImpactUnit.current]);

	const impactCategoryMemoized = useMemo(
		() =>
			impactCategoryUnitList?.impactCategoryUnitList.map(
				(element: {
					impact_category_org: IImpactCategoryData;
					impact_units_org: IImpactUnitData;
				}) => element.impact_category_org?.id
			),
		[impactCategoryUnitList]
	);

	return (
		<ImpactUnitView
			openDialog={openDialog}
			setOpenDialog={setOpenDialog}
			selectedImpactUnit={selectedImpactUnit}
			initialValues={getInitialValues(
				selectedImpactUnit.current,
				impactCategoryMemoized || []
			)}
			impactUnitList={impactUnitList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		/>
	);
}

export default ImpactUnitContainer;
