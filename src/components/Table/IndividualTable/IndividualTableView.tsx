import React from "react";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import CommonTable from "../CommonTable";
import { IIndividual } from "../../../models/individual";
import { individualTableOrganizationHeadings, individualTableProjectHeadings } from "../constants";
import { Grid, Box, Chip, Avatar } from "@material-ui/core";
import IndividualDialog from "../../IndividualDialog";
import { FORM_ACTIONS, Enitity_Name } from "../../../models/constants";
import ContactListDialog from "../../ContactListDialog";
import FilterList from "../../FilterList";
import { individualInputFields } from "./inputFields.json";
import { IndividualTableType, IndividualDialogType } from "../../../models/individual/constant";
import ContactFormGraphql from "../../Forms/ContactDetails/ContactForm";

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
	filterList: {
		[key: string]: string | string[];
	};
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	contactCreateAccess: boolean;
	contactFindAccess: boolean;
	individualEditAccess: boolean;
	individualTableType: IndividualTableType;
}

let rows = [
	{ valueAccessKey: "name" },
	{
		valueAccessKey: "",
		renderComponent: (individual: IGET_INDIVIDUAL_LIST["t4DIndividuals"][0]) => (
			<Grid container direction="row">
				{individual.t4d_project_individuals.map(({ project }) => (
					<Box mx={1} key={project.id}>
						<Chip label={project.name} size="small" />
					</Box>
				))}
			</Grid>
		),
	},
	{ valueAccessKey: "" },
];

const chipArray = ({
	elementList,
	removeChip,
	name,
}: {
	removeChip: (index: number) => void;
	elementList: string[];
	name: string;
}) => {
	return elementList.map((element, index) => (
		<Box m={1} key={index}>
			<Chip
				label={element}
				onDelete={() => removeChip(index)}
				avatar={
					<Avatar
						style={{
							width: "30px",
							height: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
			/>
		</Box>
	));
};

const createChipArray = ({
	filterListObjectKeyValuePair,
	removeFilterListElements,
}: {
	filterListObjectKeyValuePair: any;
	removeFilterListElements: (key: string, index?: number | undefined) => void;
}) => {
	if (filterListObjectKeyValuePair[1] && typeof filterListObjectKeyValuePair[1] == "string") {
		return chipArray({
			elementList: [filterListObjectKeyValuePair[1]],
			name: filterListObjectKeyValuePair[0].slice(0, 4),
			removeChip: (index: number) => {
				removeFilterListElements(filterListObjectKeyValuePair[0]);
			},
		});
	}

	return null;
};
const individualEditMenu = ["", "", ""];

const getTableRows = (tableType: IndividualTableType) =>
	tableType === IndividualTableType.organization ? [...rows] : rows.slice(0, 1);

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
	filterList,
	removeFilterListElements,
	setFilterList,
	contactCreateAccess,
	contactFindAccess,
	individualEditAccess,
	individualTableType,
}: IIndividualTableView) {
	let tableHeadings =
		individualTableType == IndividualTableType.organization
			? individualTableOrganizationHeadings
			: individualTableProjectHeadings;

	tableHeadings[tableHeadings.length - 1].renderComponent = () => (
		<FilterList
			initialValues={{
				name: "",
			}}
			setFilterList={setFilterList}
			inputFields={individualInputFields}
		/>
	);
	if (contactFindAccess) {
		individualEditMenu[2] = "Show Contacts";
	} else {
		individualEditMenu[2] = "";
	}
	if (contactCreateAccess) {
		individualEditMenu[1] = "Add Contact";
	} else {
		individualEditMenu[1] = "";
	}
	if (individualEditAccess) {
		individualEditMenu[0] = "Edit Individual";
	} else {
		individualEditMenu[0] = "";
	}

	let tableRows = getTableRows(individualTableType);
	return (
		<>
			<Grid container>
				<Grid item xs={12}>
					<Box display="flex" flexWrap="wrap">
						{Object.entries(filterList).map((filterListObjectKeyValuePair) =>
							createChipArray({
								filterListObjectKeyValuePair,
								removeFilterListElements,
							})
						)}
					</Box>
				</Grid>
			</Grid>
			<CommonTable
				tableHeadings={tableHeadings}
				valuesList={individualList}
				rows={tableRows}
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
						dialogType={
							individualTableType === IndividualTableType.organization
								? IndividualDialogType.organization
								: IndividualDialogType.project
						}
					/>
					<ContactFormGraphql
						open={openDialogs[dialogType.contact]}
						handleClose={() => toggleDialogs(dialogType.contact, false)}
						entity_name={Enitity_Name.individual}
						entity_id={initialValues.id}
						formAction={FORM_ACTIONS.CREATE}
					/>
					<ContactListDialog
						open={openDialogs[dialogType.contactList]}
						handleClose={() => toggleDialogs(dialogType.contactList, false)}
						entity_name={Enitity_Name.individual}
						entity_id={initialValues.id}
					/>
				</>
			</CommonTable>
		</>
	);
}

export default IndividualTableView;
