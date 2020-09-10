import React, { useState, useRef } from "react";
import ImpactCategoryView from "./ImpactCategoryView";
import { IGetImpactCategory } from "../../../models/impact/query";
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

function ImpactCategoryContainer({
	impactCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	impactCategoryList: IImpactCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const selectedImpactCategory = useRef<IImpactCategoryData | null>(null);

	return (
		<ImpactCategoryView
			openDialog={openDialog}
			setOpenDialog={setOpenDialog}
			selectedImpactCategory={selectedImpactCategory}
			initialValues={getInitialValues(selectedImpactCategory.current)}
			impactCategoryList={impactCategoryList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		/>
	);
}

export default ImpactCategoryContainer;