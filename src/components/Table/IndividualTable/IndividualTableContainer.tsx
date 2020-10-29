import React, { useRef, useState } from "react";
import IndividualTableView from "./IndividualTableView";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import { IIndividualForm } from "../../../models/individual";

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

const getInitialValues = (
	indiviual: { id: string; name: string } | null
): { id: string; name: string } => {
	return {
		name: indiviual?.name || "",
		id: indiviual?.id || "",
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
	const selectedIndividual = useRef<{ id: string; name: string } | null>(null);
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);

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
