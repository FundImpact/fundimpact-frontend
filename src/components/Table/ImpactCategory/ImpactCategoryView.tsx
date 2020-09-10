import React from "react";
import CommonTable from "../CommonTable";
import BudgetCategory from "../../Budget/BudgetCategory";
import { FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactCategoryData } from "../../../models/impact/impact";
import { IGetImpactCategory } from "../../../models/impact/query";
import AmountSpent from "../Budget/BudgetTargetTable/AmountSpent";
import ImpactUnit from "../ImpactUnit";
import { Box, Typography } from "@material-ui/core";

//try to shift it to constants
const tableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Impact Category" },
	{ label: "Code" },
	{ label: "Description" },
	{ label: "" },
	{ label: "" },
];

const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{ valueAccessKey: "" },
];

function ImpactCategoryView({
	setOpenDialog,
	openDialog,
	selectedImpactCategory,
	initialValues,
	impactCategoryList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
	openDialog: boolean;
	selectedImpactCategory: React.MutableRefObject<IImpactCategoryData | null>;
	initialValues: IImpactCategoryData;
	impactCategoryList: IImpactCategoryData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	return (
		<CommonTable
			tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
			valuesList={impactCategoryList}
			rows={rows}
			selectedRow={selectedImpactCategory}
			setOpenDialog={setOpenDialog}
			editMenuName={"Edit Impact Category"}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		>
			<ImpactCategoryDialog
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenDialog(false)}
				open={openDialog}
				initialValues={initialValues}
			/>
			<ImpactUnit collapsableTable={false} />
		</CommonTable>
	);
}

export default ImpactCategoryView;