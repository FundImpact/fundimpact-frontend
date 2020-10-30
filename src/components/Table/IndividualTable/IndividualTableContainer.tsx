import React, { useRef, useState } from "react";
import IndividualTableView from "./IndividualTableView";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import { IIndividualForm, IIndividual } from "../../../models/individual";

interface IIndividualTableContainer {
	individualList: IGET_INDIVIDUAL_LIST["t4DIndividuals"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
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
}: IIndividualTableContainer) {
	const selectedIndividual = useRef<IIndividual | null>(null);
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false, false, false]);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};

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
		/>
	);
}

export default IndividualTableContainer;
