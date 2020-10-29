import React, { useState, useRef } from "react";
import { IGetContact } from "../../../models/contact/query";
import CommonTable from "../CommonTable";
import { contactTableHeadings } from "../constants";

const rows = [
  { valueAccessKey: "email" },
	{ valueAccessKey: "email_other" },
	{ valueAccessKey: "phone" },
	{ valueAccessKey: "phone_other" },
	{ valueAccessKey: "contact_type" },
	{ valueAccessKey: "" },
];

function ContactTableView({ contactList }: { contactList: IGetContact["t4DContacts"] }) {
	const conatctEditMenu = ["Edit Contact"];
	const [p, setP] = useState<string>("");
	const [d, setD] = useState<"asc" | "desc">("asc");
	const selectedIndividual = useRef<{ id: string; name: string } | null>(null);
	console.log("contactList :>> ", contactList);
	return (
		<CommonTable
			tableHeadings={contactTableHeadings}
			valuesList={contactList}
			rows={rows}
			selectedRow={selectedIndividual}
			toggleDialogs={(index: number, val: boolean) => {}}
			editMenuName={conatctEditMenu}
			collapsableTable={false}
			changePage={(prev?: boolean) => {}}
			loading={false}
			count={10}
			order={"asc"}
			setOrder={setD}
			orderBy={"created_at"}
			setOrderBy={setP}
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

export default ContactTableView;
