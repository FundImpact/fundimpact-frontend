import React, { useRef, useState } from "react";
import AddressTableView from "./AddressTableView";
import { IGetContact } from "../../../models/contact/query";
import { IContact } from "../../../models/contact";
import { contactTableHeadings } from "../constants";
import { IAddress } from "../../../models/address";
import { IGetAddress } from "../../../models/address/query";
import { add } from "date-fns";

interface IAddressTableContainer {
	addressList: IGetAddress["t4DAddresses"];
	changePage: (prev?: boolean | undefined) => void;
	loading: boolean;
	count: number;
	order: "asc" | "desc";
	setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	orderBy: string;
	setOrderBy: React.Dispatch<React.SetStateAction<string>>;
}

const getInitialValues = (address: IAddress | null): IAddress => {
	return {
		address_line_1: address?.address_line_1 || "",
		address_line_2: address?.address_line_2 || "",
		address_type: address?.address_type || "",
		city: address?.city || "",
		id: address?.id || "",
		pincode: address?.pincode || "",
	};
};

function AddressTableContainer({
	addressList,
	changePage,
	count,
	loading,
	order,
	orderBy,
	setOrder,
	setOrderBy,
}: IAddressTableContainer) {
	const selectedAddress = useRef<IAddress | null>(null);
	const [openDialogs, setOpenDialogs] = useState<boolean[]>([false]);

	const toggleDialogs = (index: number, val: boolean) => {
		setOpenDialogs((openStatus) =>
			openStatus.map((element: boolean, i) => (i === index ? val : element))
		);
	};

	return (
		<AddressTableView
			addressList={addressList}
			openDialogs={openDialogs}
			toggleDialogs={toggleDialogs}
			selectedAddress={selectedAddress}
			initialValues={getInitialValues(selectedAddress.current)}
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

export default AddressTableContainer;
