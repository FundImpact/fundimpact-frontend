import React, { useState, useRef } from "react";
import { IGetContact } from "../../../models/contact/query";
import CommonTable from "../CommonTable";
import { contactTableHeadings } from "../constants";
import { IContact } from "../../../models/contact";
import AddContactAddressDialog from "../../AddContactAddressDialog";
import { AddContactAddressDialogType, Enitity, FORM_ACTIONS } from "../../../models/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import AddressTable from "../AddressTable";
import { Grid, Box, Chip, Avatar } from "@material-ui/core";
import { contactInputFields } from "./inputFields.json";
import FilterList from "../../FilterList";

interface IContactTableView {
	contactList: IGetContact["t4DContacts"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
	selectedContact: React.MutableRefObject<IContact | null>;
	toggleDialogs: (index: number, val: boolean) => void;
	openDialogs: boolean[];
	initialValues: IContact;
	filterList: {
		[key: string]: string | string[];
	};
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
}

(contactInputFields[4].optionsArray as { id: string; name: string }[]) = [
	{ id: "PERSONAL", name: "PERSONAL" },
	{ id: "OFFICE", name: "OFFICE" },
];

const chipArray = ({
	elementList,
	name,
	removeChip,
}: {
	removeChip: (index: number) => void;
	elementList: string[];
	name: string;
}) => {
	return elementList.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				label={element}
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
				onDelete={() => removeChip(index)}
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
	if (filterListObjectKeyValuePair[1] && Array.isArray(filterListObjectKeyValuePair[1])) {
		if (filterListObjectKeyValuePair[0] === "contact_type") {
			return chipArray({
				elementList: filterListObjectKeyValuePair[1],
				name: "cont",
				removeChip: (index: number) => {
					removeFilterListElements(filterListObjectKeyValuePair[0], index);
				},
			});
		}
	}
	return null;
};

const rows = [
	{ valueAccessKey: "email" },
	{ valueAccessKey: "email_other" },
	{ valueAccessKey: "phone" },
	{ valueAccessKey: "phone_other" },
	{ valueAccessKey: "contact_type" },
	{ valueAccessKey: "" },
];

function ContactTableView({
	contactList,
	setOrderBy,
	setOrder,
	orderBy,
	order,
	loading,
	count,
	changePage,
	openDialogs,
	toggleDialogs,
	initialValues,
	selectedContact,
	filterList,
	removeFilterListElements,
	setFilterList,
}: IContactTableView) {
	const dashboardData = useDashBoardData();
	const conatctEditMenu = ["Edit Contact"];

	contactTableHeadings[contactTableHeadings.length - 1].renderComponent = () => (
		<FilterList
			initialValues={{
				email: "",
				email_other: "",
				phone: "",
				phone_other: "",
				contact_type: [],
			}}
			setFilterList={setFilterList}
			inputFields={contactInputFields}
		/>
	);

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
				tableHeadings={contactTableHeadings}
				valuesList={contactList}
				rows={rows}
				selectedRow={selectedContact}
				toggleDialogs={toggleDialogs}
				editMenuName={conatctEditMenu}
				collapsableTable={true}
				changePage={changePage}
				loading={loading}
				count={count}
				order={order}
				setOrder={setOrder}
				orderBy={orderBy}
				setOrderBy={setOrderBy}
			>
				<AddContactAddressDialog
					dialogType={AddContactAddressDialogType.contact}
					entity_id={dashboardData?.organization?.id || ""}
					entity_name={Enitity.organization}
					open={openDialogs[0]}
					handleClose={() => toggleDialogs(0, false)}
					formActions={FORM_ACTIONS.UPDATE}
					contactFormInitialValues={initialValues}
				/>
				{(rowData: { id: string }) => (
					<>
						<AddressTable contactId={rowData.id} />
					</>
				)}
			</CommonTable>
		</>
	);
}

export default ContactTableView;
