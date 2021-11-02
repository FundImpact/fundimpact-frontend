import React, { useState, useRef } from "react";
import { IGeoRegions } from "../../../models/GeoRegions";
import GeoRegionsTableView from "./GeoRegionsTableView";

const getInitialValues = (geoRegions: Required<IGeoRegions> | null): Required<IGeoRegions> => {
	return {
		description: geoRegions?.description || "",
		id: geoRegions?.id || "",
		name: geoRegions?.name || "",
		country_id: geoRegions?.country_id || "",
		state_id: geoRegions?.state_id || "",
		district_id: geoRegions?.district_id || "",
		block_id: geoRegions?.block_id || "",
		gp_id: geoRegions?.gp_id || "",
		village_id: geoRegions?.village_id || "",
	};
};

function GeoRegionsTableContainer({
	geoRegionsList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	geoRegionsTableRefetch,
}: {
	geoRegionsList: Required<IGeoRegions>[];
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
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeoRegions={selectedGeoRegions}
			initialValues={getInitialValues(selectedGeoRegions.current)}
			geoRegionsList={geoRegionsList}
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
