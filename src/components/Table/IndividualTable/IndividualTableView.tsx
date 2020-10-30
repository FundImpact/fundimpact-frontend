import React from "react";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import CommonTable from "../CommonTable";
import { IIndividualForm, IIndividual } from "../../../models/individual";
import { individualTableHeadings } from "../constants";
import { Grid, Box } from "@material-ui/core";
import IndividualDialog from "../../IndividualDialog";
import { FORM_ACTIONS, Enitity } from "../../../models/constants";
import AddContactAddressDialog from "../../AddContactAddressDialog";
import ContactListDialog from "../../ContactListDialog";

enum dialogType {
	individual = 0,
	contact = 1,
	contactList = 2,
}

interface IIndividualTableView {
	individualList: IGET_INDIVIDUAL_LIST["t4DIndividuals"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	selectedIndividual: React.MutableRefObject<IIndividual | null>;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	initialValues: IIndividual;
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
	const individualEditMenu = ["Edit Individual", "Add Contact", "Show Contacts"];

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
			<>
				<IndividualDialog
					formAction={FORM_ACTIONS.UPDATE}
					initialValues={initialValues}
					handleClose={() => toggleDialogs(dialogType.individual, false)}
					open={openDialogs[dialogType.individual]}
				/>
				<AddContactAddressDialog
					open={openDialogs[dialogType.contact]}
					handleClose={() => toggleDialogs(dialogType.contact, false)}
					entity_name={Enitity.individual}
					entity_id={initialValues.id}
				/>
				<ContactListDialog
					open={openDialogs[dialogType.contactList]}
					handleClose={() => toggleDialogs(dialogType.contactList, false)}
					entity_name={Enitity.individual}
					entity_id={initialValues.id}
				/>
			</>
		</CommonTable>
	);
}

export default IndividualTableView;
