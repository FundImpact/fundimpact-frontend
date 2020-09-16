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
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const selectedImpactCategory = useRef<IImpactCategoryData | null>(null);

	return (
		<ImpactCategoryTableView
			openDialog={openDialog}
			setOpenDialog={setOpenDialog}
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
		/>
	);
}

export default ImpactCategoryTableContainer;
