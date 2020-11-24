import React, { useState } from "react";
import { IGetContact } from "../../../models/contact/query";
import { contactTableHeadings } from "../constants";
import { IContact } from "../../../models/contact";
import { Enitity_Name } from "../../../models/constants";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { Grid, Box, Chip, Avatar } from "@material-ui/core";
import { contactInputFields } from "./inputFields.json";
import FilterList from "../../FilterList";
import ContactCard from "../../ContactCard";
import Pagination from "@material-ui/lab/Pagination";

interface IContactTableView {
	contactList: IGetContact["t4DContacts"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	filterList: {
		[key: string]: string | string[];
	};
	removeFilterListElements: (key: string, index?: number | undefined) => void;
	setFilterList: React.Dispatch<
		React.SetStateAction<{
			[key: string]: string | string[];
		}>
	>;
	contactEditAccess: boolean;
	entity_name: Enitity_Name;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
}

(contactInputFields[4].optionsArray as { id: string; name: string }[]) = [
	{ id: "PERSONAL", name: "PERSONAL" },
	{ id: "OFFICE", name: "OFFICE" },
];

const chipArray = ({
	name,
	removeChip,
	elementList,
}: {
	removeChip: (index: number) => void;
	elementList: string[];
	name: string;
}) => {
	return elementList.map((element, index) => (
		<Box key={index} m={1}>
			<Chip
				avatar={
					<Avatar
						style={{
							height: "30px",
							width: "30px",
						}}
					>
						<span>{name}</span>
					</Avatar>
				}
				label={element}
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

function ContactTableView({
	contactList,
	loading,
	count,
	changePage,
	setFilterList,
	contactEditAccess,
	entity_name,
	page,
	setPage,
}: IContactTableView) {
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
			<Grid container spacing={2}>
				{contactList.map((contact) => (
					<Grid item xs={3} key={contact.id}>
						<ContactCard contactDetails={contact} entity_name={entity_name} />
					</Grid>
				))}
			</Grid>
			<Box display="flex" justifyContent="center" width="100%" mt={5}>
				<Pagination
					count={Math.ceil(count / 10)}
					color="primary"
					page={page}
					onChange={(e, nextPage) => {
						//the difference between current page and next page can be more than 1 that is
						//why using for loop
						if (nextPage > page) {
							for (let i = 0; i < nextPage - page; i++) {
								changePage();
							}
						} else {
							for (let i = 0; i < page - nextPage; i++) {
								changePage(true);
							}
						}
						setPage(nextPage);
					}}
				/>
			</Box>
		</>
	);
}

export default ContactTableView;
