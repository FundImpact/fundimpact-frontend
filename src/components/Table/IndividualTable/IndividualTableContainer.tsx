import React, { useRef, useState } from "react";
import IndividualTableView from "./IndividualTableView";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import { IIndividualForm, IIndividual } from "../../../models/individual";
import { userHasAccess, MODULE_CODES } from "../../../utils/access";
import { CONTACT_ACTION } from "../../../utils/access/modules/contact/actions";
import { INDIVIDUAL_ACTIONS } from "../../../utils/access/modules/individual/actions";
import { IndividualTableType } from "../../../models/individual/constant";

interface IIndividualTableContainer {
	count: number;
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	individualList: IGET_INDIVIDUAL_LIST["t4DIndividuals"];
	filterList: {
		[key: string]: string | string[];
	};
	order: "asc" | "desc";
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	individualTableType: IndividualTableType;
	refetchIndividualTable: () => void;
}

const getInitialValues = (individual: IIndividual | null): IIndividual => {
	return {
		id: individual?.id || "",
		name: individual?.name || "",
		t4d_project_individuals: individual?.t4d_project_individuals || [],
	};
};

function IndividualTableContainer({
	individualList,
	changePage,
	loading,
	count,
	order,
	orderBy,
	setOrder,
	setOrderBy,
	filterList,
	removeFilterListElements,
	setFilterList,
	individualTableType,
	refetchIndividualTable,
}: IIndividualTableContainer) {
	const selectedIndividual = useRef<IIndividual | null>(null);
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false, false, false, false]);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};
	const contactCreateAccess = userHasAccess(MODULE_CODES.CONTACT, CONTACT_ACTION.CREATE_CONTACT);

	const contactFindAccess = userHasAccess(MODULE_CODES.CONTACT, CONTACT_ACTION.FIND_CONTACT);

	const individualEditAccess = userHasAccess(
		MODULE_CODES.INDIVIDUAL,
		INDIVIDUAL_ACTIONS.UPDATE_INDIVIDUAL
	);
	const individualExportAccess = userHasAccess(
		MODULE_CODES.INDIVIDUAL,
		INDIVIDUAL_ACTIONS.INDIVIDUAL_EXPORT
	);
	const individualImportAccess = userHasAccess(
		MODULE_CODES.INDIVIDUAL,
		INDIVIDUAL_ACTIONS.INDIVIDUAL_IMPORT
	);

	return (
		<IndividualTableView
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedIndividual={selectedIndividual}
			initialValues={getInitialValues(selectedIndividual.current)}
			individualList={individualList}
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
			contactCreateAccess={contactCreateAccess}
			contactFindAccess={contactFindAccess}
			individualEditAccess={individualEditAccess}
			individualTableType={individualTableType}
			individualExportAccess={individualExportAccess}
			individualImportAccess={individualImportAccess}
			refetchIndividualTable={refetchIndividualTable}
		/>
	);
}

export default IndividualTableContainer;
