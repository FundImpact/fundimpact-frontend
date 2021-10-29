import React, { useState, useRef } from "react";
import ImpactCategoryTableView from "./ImpactCategoryTableView";
import { IImpactCategoryData } from "../../../models/impact/impact";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { IMPACT_CATEGORY_ACTIONS } from "../../../utils/access/modules/impactCategory/actions";
import { IMPACT_UNIT_ACTIONS } from "../../../utils/access/modules/impactUnit/actions";
// import { ApolloQueryResult } from "@apollo/client";

const getInitialValues = (impactCategory: IImpactCategoryData | null): IImpactCategoryData => {
	return {
		code: impactCategory?.code || "",
		description: impactCategory?.description || "",
		id: impactCategory?.id || "",
		name: impactCategory?.name || "",
		shortname: impactCategory?.shortname || "",
	};
};

function ImpactCategoryTableContainer({
	impactCategoryList,
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
	impactCategoryList: IImpactCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	filterList: {
		[key: string]: string;
	};
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	reftechImpactCategoryAndUnitTable: () => void;
}) {
	const selectedImpactCategory = useRef<IImpactCategoryData | null>(null);
	const openEditImpactCategoryDialog = false,
		openDeleteImpactCategoryDialog = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		openEditImpactCategoryDialog,
		openDeleteImpactCategoryDialog,
	]);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};

	const impactCategoryEditAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.UPDATE_IMPACT_CATEGORY
	);
	const impactCategoryDeleteAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.DELETE_IMPACT_CATEGORY
	);
	const impactCategoryImportFromCsvAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.IMPACT_CATEGORY_CREATE_FROM_CSV
	);
	const impactCategoryExportAccess = userHasAccess(
		MODULE_CODES.IMPACT_CATEGORY,
		IMPACT_CATEGORY_ACTIONS.IMPACT_CATEGORY_EXPORT
	);

	const impactUnitFindAccess = userHasAccess(
		MODULE_CODES.IMPACT_UNIT,
		IMPACT_UNIT_ACTIONS.FIND_IMPACT_UNIT
	);

	return (
		<ImpactCategoryTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedImpactCategory={selectedImpactCategory}
			initialValues={getInitialValues(selectedImpactCategory.current)}
			impactCategoryList={impactCategoryList}
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
			impactCategoryEditAccess={impactCategoryEditAccess}
			impactUnitFindAccess={impactUnitFindAccess}
			reftechImpactCategoryAndUnitTable={reftechImpactCategoryAndUnitTable}
			impactCategoryDeleteAccess={impactCategoryDeleteAccess}
			impactCategoryImportFromCsvAccess={impactCategoryImportFromCsvAccess}
			impactCategoryExportAccess={impactCategoryExportAccess}
		/>
	);
}

export default ImpactCategoryTableContainer;
