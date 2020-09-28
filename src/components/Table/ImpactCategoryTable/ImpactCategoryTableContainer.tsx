import React, { useState, useRef } from "react";
import ImpactCategoryTableView from "./ImpactCategoryTableView";
import { IImpactCategoryData } from "../../../models/impact/impact";

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
}) {
	const selectedImpactCategory = useRef<IImpactCategoryData | null>(null);
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};

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
		/>
	);
}

export default ImpactCategoryTableContainer;
