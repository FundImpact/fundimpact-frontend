import React, { useState, useRef, useEffect, useMemo } from "react";
import ImpactUnitView from "./ImpactUnitTableView";
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
	order,
	setOrder,
	orderBy,
	setOrderBy,
	filterList,
	setFilterList,
	removeFilterListElements,
}: {
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	count: number;
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	order: "asc" | "desc";
	impactUnitList: IImpactUnitData[];
	loading: boolean;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	filterList: {
		[key: string]: string;
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
}) {
	const selectedImpactUnit = useRef<IImpactUnitData | null>(null);
	const [getImpactCategoryUnit, { data: impactCategoryUnitList }] = useLazyQuery(
		GET_IMPACT_CATEGORY_UNIT
	);
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedImpactUnit.current && openDialogs[0]) {
			getImpactCategoryUnit({
				variables: {
					filter: {
						impact_units_org: selectedImpactUnit.current.id,
					},
				},
			});
		}
	}, [getImpactCategoryUnit, openDialogs]);

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
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
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
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
		/>
	);
}

export default ImpactUnitContainer;
