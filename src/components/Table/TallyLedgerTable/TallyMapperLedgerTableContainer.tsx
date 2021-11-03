import React, { useState, useRef, useEffect } from "react";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { useLazyQuery } from "@apollo/client";
import { GET_CATEGORY_UNIT } from "../../../graphql/Deliverable/categoryUnit";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { DELIVERABLE_UNIT_ACTIONS } from "../../../utils/access/modules/deliverableUnit/actions";
import { DELIVERABLE_CATEGORY_ACTIONS } from "../../../utils/access/modules/deliverableCategory/actions";
import TallyMapperLedgerTableView from "./TallyMapperLedgerTableView";
import {
	IGeographiesDistrict,
	IGeographiesDistrictData,
} from "../../../models/geographies/geographiesDistrict";

const getInitialValues = (
	geographiesDistrict: IGeographiesDistrictData | null,
	organization: string | number
): IGeographiesDistrict => {
	return {
		code: geographiesDistrict?.code || "",
		state: geographiesDistrict?.state || "",
		id: parseInt(geographiesDistrict?.id || ""),
		name: geographiesDistrict?.name || "",
		// prefix_label: geographiesDistrict?.prefix_label || "",
		// suffix_label: geographiesDistrict?.suffix_label || "",
		// unit_type: geographiesDistrict?.unit_type || "",
		// deliverableCategory,
		// organization,
	};
};

function TallyMapperLedgerTableContainer({
	geographiesDistrictList,
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
	geographiesDistrictList: IGeographiesDistrictData[];
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
	const editGeographiesDistrict = false,
		deleteGeographiesDistrict = false;
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([
		editGeographiesDistrict,
		deleteGeographiesDistrict,
	]);

	const selectedGeographiesDistrict = useRef<IGeographiesDistrictData | null>(null);
	const dashboardData = useDashBoardData();
	const [getgeographiesDistrict] = useLazyQuery(GET_CATEGORY_UNIT);

	const toggleDialogs = (index: number, dialogNewOpenStatus: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? dialogNewOpenStatus : element))
		);
	};

	useEffect(() => {
		if (selectedGeographiesDistrict.current && openDialogs[0]) {
			getgeographiesDistrict({
				variables: {
					filter: {
						deliverable_units_org: selectedGeographiesDistrict.current.id,
					},
				},
			});
		}
	}, [openDialogs, getgeographiesDistrict]);

	const geographiesDistrictEditAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.UPDATE_DELIVERABLE_UNIT
	);

	const geographiesDistrictDeleteAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELETE_DELIVERABLE_UNIT
	);

	const deliverableUnitImportFromCsvAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_IMPORT_FROM_CSV
	);
	const deliverableUnitExportAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_UNIT,
		DELIVERABLE_UNIT_ACTIONS.DELIVERABLE_UNIT_EXORT
	);

	const geographiesDistrictFindAccess = userHasAccess(
		MODULE_CODES.DELIVERABLE_CATEGORY,
		DELIVERABLE_CATEGORY_ACTIONS.FIND_DELIVERABLE_CATEGORY
	);

	return (
		<TallyMapperLedgerTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedGeographiesDistrict={selectedGeographiesDistrict}
			initialValues={getInitialValues(
				selectedGeographiesDistrict.current,
				dashboardData?.organization?.id || ""
			)}
			geographiesDistrictList={geographiesDistrictList}
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
			geographiesDistrictEditAccess={geographiesDistrictEditAccess}
			geographiesDistrictFindAccess={geographiesDistrictFindAccess}
			reftechDeliverableCategoryAndUnitTable={reftechDeliverableCategoryAndUnitTable}
			geographiesDistrictDeleteAccess={geographiesDistrictDeleteAccess}
			deliverableUnitImportFromCsvAccess={deliverableUnitImportFromCsvAccess}
			deliverableUnitExportAccess={deliverableUnitExportAccess}
		/>
	);
}

export default TallyMapperLedgerTableContainer;
