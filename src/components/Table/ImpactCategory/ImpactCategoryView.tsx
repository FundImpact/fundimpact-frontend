import React from "react";
import CommonTable from "../CommonTable";
import BudgetCategory from "../../Budget/BudgetCategory";
import { FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactCategoryData } from "../../../models/impact/impact";
import { IGetImpactCategory } from "../../../models/impact/query";
import AmountSpent from "../Budget/BudgetTargetTable/AmountSpent";

//try to shift it to constants
const tableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Impact Category" },
	{ label: "Code" },
	{ label: "Description" },
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
}: {
	setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
	openDialog: boolean;
	selectedImpactCategory: React.MutableRefObject<IImpactCategoryData | null>;
	initialValues: IImpactCategoryData;
	impactCategoryList?: IGetImpactCategory;
}) {
	return (
		<CommonTable
			tableHeadings={tableHeadings}
			valuesList={impactCategoryList?.impactCategoryOrgList || []}
			rows={rows}
			selectedRow={selectedImpactCategory}
			setOpenDialog={setOpenDialog}
			editMenuName={"Edit Impact Category"}
			collapsableTable={true}
		>
			<ImpactCategoryDialog
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenDialog(false)}
				open={openDialog}
				initialValues={initialValues}
			/>
		</CommonTable>
	);
}

export default ImpactCategoryView;
