import React from "react";
import CommonTable from "../CommonTable";
import BudgetCategory from "../../Budget/BudgetCategory";
import { FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactUnitData } from "../../../models/impact/impact";
import { IGetImpactUnit } from "../../../models/impact/query";
import AmountSpent from "../Budget/BudgetTargetTable/AmountSpent";
import ImpactUnitDialog from "../../Impact/ImpactUnitDialog/ImpaceUnitDialog";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import ImpactCategory from "../ImpactCategory";
import { Box, Typography } from "@material-ui/core";

//try to shift it to constants
const tableHeadings = [
	{ label: "" },
	{ label: "#" },
	{ label: "Impact Unit" },
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

function ImpactUnitView({
	setOpenDialog,
	openDialog,
	selectedImpactUnit,
	initialValues,
	impactUnitList,
	collapsableTable,
	changePage,
	loading,
	count,
}: {
	setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
	openDialog: boolean;
	selectedImpactUnit: React.MutableRefObject<IImpactUnitData | null>;
	initialValues: IImpactUnitFormInput;
	impactUnitList: IImpactUnitData[];
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	count: number;
	loading: boolean;
}) {
	return (
		<CommonTable
			tableHeadings={collapsableTable ? tableHeadings : tableHeadings.slice(1)}
			valuesList={impactUnitList}
			rows={rows}
			selectedRow={selectedImpactUnit}
			setOpenDialog={setOpenDialog}
			editMenuName={"Edit Impact Unit"}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
		>
			<ImpactUnitDialog
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => setOpenDialog(false)}
				open={openDialog}
				initialValues={initialValues}
			/>
			<ImpactCategory collapsableTable={false} />
		</CommonTable>
	);
}

export default ImpactUnitView;
