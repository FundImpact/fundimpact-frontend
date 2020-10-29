import React from "react";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import CommonTable from "../CommonTable";
import { IIndividualForm } from "../../../models/individual";
import { individualTableHeadings } from "../constants";
import { Grid, Box } from "@material-ui/core";

interface IIndividualTableView {
	individualList: IGET_INDIVIDUAL_LIST["t4DIndividuals"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	selectedIndividual: React.MutableRefObject<{ id: string; name: string } | null>;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	initialValues: { id: string; name: string };
}

const rows = [
	{ valueAccessKey: "name" },
	{
		valueAccessKey: "",
		renderComponent: (individual: IGET_INDIVIDUAL_LIST["t4DIndividuals"][0]) => (
			<Grid container direction="row">
				{individual.t4d_project_individuals.map(({ project }) => (
					<Box mx={1} key={project.id}>
						{project.name}
					</Box>
				))}
			</Grid>
		),
	},
	{ valueAccessKey: "" },
];

function IndividualTableView({
	individualList,
	changePage,
	loading,
	count,
	order,
	orderBy,
	setOrder,
	setOrderBy,
	selectedIndividual,
	toggleDialogs,
	openDialogs,
	initialValues,
}: IIndividualTableView) {
	const individualEditMenu = ["Edit Individual"];

	return (
		<CommonTable
			tableHeadings={individualTableHeadings}
			valuesList={individualList}
			rows={rows}
			selectedRow={selectedIndividual}
			toggleDialogs={toggleDialogs}
			editMenuName={individualEditMenu}
			collapsableTable={false}
			changePage={changePage}
			loading={loading}
			count={count}
			order={order}
			setOrder={setOrder}
			orderBy={orderBy}
			setOrderBy={setOrderBy}
		>
			{/* <BudgetCategory
				formAction={FORM_ACTIONS.UPDATE}
				handleClose={() => toggleDialogs(0, false)}
				open={openDialogs[0]}
				initialValues={initialValues}
			/> */}
		</CommonTable>
	);
}

export default IndividualTableView;
