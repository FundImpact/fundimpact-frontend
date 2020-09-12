import React from "react";
import CommonTable from "../CommonTable";
import { FORM_ACTIONS } from "../../../models/constants";
import ImpactCategoryDialog from "../../Impact/ImpactCategoryDialog";
import { IImpactCategoryData } from "../../../models/impact/impact";
import ImpactUnit from "../ImpactUnitTable";
import { impactCategoryTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";


const rows = [
	{ valueAccessKey: "name" },
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (id: string) => <UnitsAndCategoriesProjectCount impactCategoryId={id} />,
	},
	{ valueAccessKey: "" },
];

function ImpactCategoryTableView({
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

export default ImpactCategoryTableView;
