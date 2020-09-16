import React from "react";
import CommonTable from "../CommonTable";
import { FORM_ACTIONS } from "../../../models/constants";
import { IImpactUnitData } from "../../../models/impact/impact";
import ImpactUnitDialog from "../../Impact/ImpactUnitDialog/ImpaceUnitDialog";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";
import ImpactCategory from "../ImpactCategoryTable";
import { impactUnitTableHeadings as tableHeadings } from "../constants";
import UnitsAndCategoriesProjectCount from "../../UnitsAndCategoriesProjectCount";

const rows = [
	{
		valueAccessKey: "name",
	},
	{ valueAccessKey: "code" },
	{ valueAccessKey: "description" },
	{
		valueAccessKey: "",
		renderComponent: (id: string) => <UnitsAndCategoriesProjectCount impactUnitId={id} />,
	},
	{ valueAccessKey: "" },
];

function ImpactUnitTableContainer({
	setOpenDialog,
	openDialog,
	selectedImpactUnit,
	initialValues,
	impactUnitList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
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
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
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
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}	
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

export default ImpactUnitTableContainer;
