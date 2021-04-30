import React from "react";
import { IGET_INDIVIDUAL_LIST } from "../../../models/individual/query";
import CommonTable from "../CommonTable";
import { IIndividual } from "../../../models/individual";
import { individualTableOrganizationHeadings, individualTableProjectHeadings } from "../constants";
import { Grid, Box, Chip, Avatar, Button, useTheme } from "@material-ui/core";
import IndividualDialog from "../../IndividualDialog";
import { FORM_ACTIONS, Entity_Name } from "../../../models/constants";
import ContactListDialog from "../../ContactListDialog";
import FilterList from "../../FilterList";
import { individualInputFields } from "./inputFields.json";
import { IndividualTableType, IndividualDialogType } from "../../../models/individual/constant";
import ContactDialogGraphql from "../../ContactDialog";
import ImportExportTableMenu from "../../ImportExportTableMenu";
import { exportTable } from "../../../utils/importExportTable.utils";
import { PROJECT_EXPORT } from "../../../utils/endpoints.util";
import { useAuth } from "../../../contexts/userContext";
import { INDIVIDUAL_EXPORT, INDIVIDUAL_IMPORT } from "../../../utils/endpoints.util";
import { useDashBoardData } from "../../../contexts/dashboardContext";

enum dialogType {
	individual = 0,
	delete = 1,
	contact = 2,
	contactList = 3,
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
	individualExportAccess: boolean;
	individualImportAccess: boolean;
	refetchIndividualTable: () => void;
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
	individualExportAccess,
	individualImportAccess,
	refetchIndividualTable,
}: IIndividualTableView) {
	const theme = useTheme();
	const { jwt } = useAuth();
	let tableHeadings =
		individualTableType == IndividualTableType.organization
			? individualTableOrganizationHeadings
			: individualTableProjectHeadings;
	const dashboardData = useDashBoardData();

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
		individualEditMenu[3] = "Show Contacts";
	} else {
		individualEditMenu[3] = "";
	}
	if (contactCreateAccess) {
		individualEditMenu[2] = "Add Contact";
	} else {
		individualEditMenu[2] = "";
	}
	if (individualEditAccess) {
		individualEditMenu[1] = "Delete Individual";
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
				tableActionButton={({ importButtonOnly }: { importButtonOnly?: boolean }) => (
					<ImportExportTableMenu
						tableName="Individual"
						tableExportUrl={
							individualTableType == IndividualTableType.organization
								? INDIVIDUAL_EXPORT
								: `${INDIVIDUAL_EXPORT}/${dashboardData?.project?.id}`
						}
						tableImportUrl={
							individualTableType == IndividualTableType.organization
								? INDIVIDUAL_IMPORT
								: `${INDIVIDUAL_IMPORT}/${dashboardData?.project?.id}`
						}
						onImportTableSuccess={refetchIndividualTable}
						importButtonOnly={importButtonOnly}
						hideImport={!individualImportAccess}
						hideExport={!individualExportAccess}
					>
						<>
							{individualTableType == IndividualTableType.organization && (
								<Button
									variant="outlined"
									style={{ marginRight: theme.spacing(1) }}
									onClick={() =>
										exportTable({
											tableName: "Project",
											jwt: jwt as string,
											tableExportUrl: `${PROJECT_EXPORT}`,
										})
									}
								>
									Project Export
								</Button>
							)}
							<Button
								variant="outlined"
								style={{ marginRight: theme.spacing(1), float: "right" }}
								onClick={() =>
									exportTable({
										tableName: "Individual Template",
										jwt: jwt as string,
										tableExportUrl:
											individualTableType == IndividualTableType.organization
												? `${INDIVIDUAL_EXPORT}?header=true`
												: `${INDIVIDUAL_EXPORT}/${dashboardData?.project?.id}?header=true`,
									})
								}
							>
								Individual Template
							</Button>
						</>
					</ImportExportTableMenu>
				)}
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
					<IndividualDialog
						formAction={FORM_ACTIONS.UPDATE}
						initialValues={initialValues}
						handleClose={() => toggleDialogs(dialogType.delete, false)}
						open={openDialogs[dialogType.delete]}
						dialogType={
							individualTableType === IndividualTableType.organization
								? IndividualDialogType.organization
								: IndividualDialogType.project
						}
						deleteIndividual={true}
					/>
					<ContactDialogGraphql
						open={openDialogs[dialogType.contact]}
						handleClose={() => toggleDialogs(dialogType.contact, false)}
						entity_name={Entity_Name.individual}
						entity_id={initialValues.id}
						formAction={FORM_ACTIONS.CREATE}
					/>
					<ContactListDialog
						open={openDialogs[dialogType.contactList]}
						handleClose={() => toggleDialogs(dialogType.contactList, false)}
						entity_name={Entity_Name.individual}
						entity_id={initialValues.id}
					/>
				</>
			</CommonTable>
		</>
	);
}

export default IndividualTableView;
