import React, { useState, useRef, useEffect } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import TallyMapperLedgerGroupTableView from "./TallyMapperLedgerGroupTableView";
import {
	IGeographiesBlock,
	IGeographiesBlockData,
} from "../../../models/geographies/geographiesBlock";

const getInitialValues = (
	geographiesBlock: IGeographiesBlockData | null,
	organization: string | number
): IGeographiesBlock => {
	return {
		code: geographiesBlock?.code || "",
		district: geographiesBlock?.district || "",
		id: parseInt(geographiesBlock?.id || ""),
		name: geographiesBlock?.name || "",
		// prefix_label: geographiesBlock?.prefix_label || "",
		// suffix_label: geographiesBlock?.suffix_label || "",
		// unit_type: geographiesBlock?.unit_type || "",
		// deliverableCategory,
		// organization,
	};
};

function TallyMapperLedgerGroupTableContainer({
	geographiesBlocksList,
	collapsableTable,
	changePage,
	loading,
	count,
	order,
	setOrder,
	orderBy,
	setOrderBy,
	filterList,
	setFilterList,
	removeFilterListElements,
	reftechDeliverableCategoryAndUnitTable,
}: {
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	collapsableTable: boolean;
	changePage: (prev?: boolean) => void;
	orderBy: string;
	geographiesBlocksList: IGeographiesBlockData[];
	filterList: {
		[key: string]: string;
	};
	loading: boolean;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string;
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	reftechDeliverableCategoryAndUnitTable: () => void;
}) {
	const editGeographiesBlock = false,
		deleteGeographiesBlock = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesBlock,
		deleteGeographiesBlock,
	]);

	const selectedGeographiesBlock = useRef<IGeographiesBlockData | null>(null);
	const dashboardData = useDashBoardData();
	const [getcategoryUnit] = useLazyQuery(GET_CATEGORY_UNIT);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedGeographiesBlock.current && openDialogs[0]) {
			getcategoryUnit({
				variables: {
					filter: {
						deliverable_units_org: selectedGeographiesBlock.current.id,
					},
				},
			});
		}
	}, [openDialogs, getcategoryUnit]);

	const geographiesBlockEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);

	const geographiesBlockDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	);

	const geographiesBlockImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_IMPORT_FROM_CSV
	);
	const geographiesBlockExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_EXORT
	);

	const geographiesBlockFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	return (
		<TallyMapperLedgerGroupTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesBlock={selectedGeographiesBlock}
			initialValues={getInitialValues(
				selectedGeographiesBlock.current,
				dashboardData?.organization?.id || ""
			)}
			geographiesBlocksList={geographiesBlocksList}
			collapsableTable={collapsableTable}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
			filterList={filterList}
			setFilterList={setFilterList}
			removeFilterListElements={removeFilterListElements}
			geographiesBlockEditAccess={geographiesBlockEditAccess}
			geographiesBlockFindAccess={geographiesBlockFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesBlockDeleteAccess={geographiesBlockDeleteAccess}
			geographiesBlockImportFromCsvAccess={geographiesBlockImportFromCsvAccess}
			geographiesBlockExportAccess={geographiesBlockExportAccess}
		/>
	);
}

export default TallyMapperLedgerGroupTableContainer;
