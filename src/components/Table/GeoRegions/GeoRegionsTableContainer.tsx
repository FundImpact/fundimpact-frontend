import React, { useState, useRef } from "react";
// import BudgetCategoryTableView from "./BudgetCategoryTableView";
import { IBudgetCategory } from "../../../models/budget";
import { IGeoRegions } from "../../../models/GeoRegions";
import GeoRegionsTableView from "./GeoRegionsTableView";
// import { ApolloQueryResult, OperationVariables } from "@apollo/client";

const getInitialValues = (
	geoRegions: Required<IGeoRegions> | null
	// budgetCategory: Required<IBudgetCategory> | null
): Required<IGeoRegions> => {
	return {
		code: geoRegions?.code || "",
		// code: budgetCategory?.code || "",
		description: geoRegions?.description || "",
		id: geoRegions?.id || "",
		name: geoRegions?.name || "",
	};
};

function GeoRegionsTableContainer({
	geoRegionsList,
	// budgetCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	geoRegionsTableRefetch,
}: // budgetCategoryTableRefetch,
{
	geoRegionsList: Required<IGeoRegions>[];
	// budgetCategoryList: Required<IBudgetCategory>[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	geoRegionsTableRefetch: () => void;
	// budgetCategoryTableRefetch: () => void;
}) {
	const selectedGeoRegions = useRef<Required<IGeoRegions> | null>(null);
	const openEditGeoRegionsDialog = false,
		openDeleteGeoRegionsDialog = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		openEditGeoRegionsDialog,
		openDeleteGeoRegionsDialog,
	]);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};

	return (
		<GeoRegionsTableView
			// <BudgetCategoryTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeoRegions={selectedGeoRegions}
			initialValues={getInitialValues(selectedGeoRegions.current)}
			geoRegionsList={geoRegionsList}
			// budgetCategoryList={budgetCategoryList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			geoRegionsTableRefetch={geoRegionsTableRefetch}
		/>
	);
}

export default GeoRegionsTableContainer;
