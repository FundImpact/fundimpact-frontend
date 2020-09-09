import React, { useState, useRef } from "react";
import ImpactUnitView from "./ImpactUnitView";
import { IGetImpactUnit } from "../../../models/impact/query";
import { IImpactUnitData } from "../../../models/impact/impact";
import { IImpactUnitFormInput } from "../../../models/impact/impactForm";

const getInitialValues = (impactUnit: IImpactUnitData | null): IImpactUnitFormInput => {
	return {
		code: impactUnit?.code || "",
		description: impactUnit?.description || "",
		id: impactUnit?.id || "",
		name: impactUnit?.name || "",
		target_unit: impactUnit?.target_unit + "" || "",
		prefix_label: impactUnit?.prefix_label || "",
		suffix_label: impactUnit?.suffix_label || "",
		impactCategory: "",
	};
};

function ImpactUnitContainer({
	impactUnitList,
	collapsableTable,
}: {
	impactUnitList: IImpactUnitData[];
	collapsableTable: boolean
}) {
	const [openDialog, setOpenDialog] = useState<boolean>(false);
	const selectedImpactUnit = useRef<IImpactUnitData | null>(null);

	return (
		<ImpactUnitView
			openDialog={openDialog}
			setOpenDialog={setOpenDialog}
			selectedImpactUnit={selectedImpactUnit}
			initialValues={getInitialValues(selectedImpactUnit.current)}
			impactUnitList={impactUnitList}
			collapsableTable={collapsableTable}
		/>
	);
}

export default ImpactUnitContainer;
