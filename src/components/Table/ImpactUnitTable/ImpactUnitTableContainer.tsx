import React, { useState, useRef, useEffect, useMemo } from "react";
import ImpactUnitView from "./ImpactUnitTableView";
import { IImpactUnitData, IImpactCategoryData } from "../../../models/impact/impact";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import { GET_IMPACT_CATEGORY_UNIT } from "../../../graphql/Impact/categoryUnit";
import { useLazyQuery } from "@apollo/client";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { IMPACT_UNIT_ACTIONS } from "../../../utils/access/modules/impactUnit/actions";
import { IMPACT_CATEGORY_ACTIONS } from "../../../utils/access/modules/impactCategory/actions";
import { IGetDeliverableCategoryUnit } from "../../../models/deliverable/query";
import { IGetImpactCategoryUnit } from "../../../models/impact/query";

const getInitialValues = (
	impactUnit: IImpactUnitData | null
	// impactCategory: string[]
): IImpactUnitFormInput => {
	return {
		code: impactUnit?.code || "",
		description: impactUnit?.description || "",
		id: impactUnit?.id || "",
		name: impactUnit?.name || "",
		target_unit: impactUnit?.target_unit + "" || "",
		prefix_label: impactUnit?.prefix_label || "",
		suffix_label: impactUnit?.suffix_label || "",
		// impactCategory,
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
	reftechImpactCategoryAndUnitTable,
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
	reftechImpactCategoryAndUnitTable: () => void;
}) {
	const selectedImpactUnit = useRef<IImpactUnitData | null>(null);
	const [getImpactCategoryUnit, { data: impactCategoryUnitList }] = useLazyQuery(
		GET_IMPACT_CATEGORY_UNIT
	);
	const openEditImpactUnitDialog = false,
		openDeleteImpactUnitDialog = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		openEditImpactUnitDialog,
		openDeleteImpactUnitDialog,
	]);

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
			impactCategoryUnitList?.impactCategoryUnitList
				.filter(
					(element: IGetImpactCategoryUnit["impactCategoryUnitList"][0]) => element.status
				)
				.map(
					(element: IGetImpactCategoryUnit["impactCategoryUnitList"][0]) =>
						element.impact_category_org?.id
				),
		[impactCategoryUnitList]
	);

	const impactUnitEditAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.UPDATE_IMPACT_UNIT
	);
	const impactUnitDeleteAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.DELETE_IMPACT_UNIT
	);
	const impactUnitImportFromCsvAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.IMPACT_UNIT_IMPORT_FROM_CSV
	);
	const impactUnitExportAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.IMPACT_UNIT_EXPORT
	);

	const impactCategoryFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.FIND_IMPACT_CATEGORY
	);

	return (
		<ImpactUnitView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedImpactUnit={selectedImpactUnit}
			initialValues={getInitialValues(selectedImpactUnit.current)}
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
			impactUnitEditAccess={impactUnitEditAccess}
			impactCategoryFindAccess={impactCategoryFindAccess}
			reftechImpactCategoryAndUnitTable={reftechImpactCategoryAndUnitTable}
			impactUnitDeleteAccess={impactUnitDeleteAccess}
			impactUnitImportFromCsvAccess={impactUnitImportFromCsvAccess}
			impactUnitExportAccess={impactUnitExportAccess}
		/>
	);
}

export default ImpactUnitContainer;
