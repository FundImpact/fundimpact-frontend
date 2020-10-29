import React, { useEffect, useState } from "react";
import AddressTableContainer from "./AddressTableContainer";
import { useLazyQuery } from "@apollo/client";
import { IGetContact } from "../../../models/contact/query";
import { GET_CONTACT_LIST } from "../../../graphql/Contact";
import { useDashBoardData } from "../../../contexts/dashboardContext";
import { IGetAddress, IGetAddressVariables } from "../../../models/address/query";
import { GET_ADDRESS_LIST } from "../../../graphql/Address";

function AddressTableGraphql({ contactId }: { contactId: string }) {
	const dashboardData = useDashBoardData();
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});
	const [getAddressList, { data: addressList, loading: fetchingAddressList }] = useLazyQuery<
		IGetAddress,
		IGetAddressVariables
	>(GET_ADDRESS_LIST);

	useEffect(() => {
		if (dashboardData) {
			getAddressList({
				variables: {
					where: {
						t_4_d_contact: contactId,
					},
				},
			});
		}
	}, [getAddressList, dashboardData]);

	return (
		<AddressTableContainer
			addressList={addressList?.t4DAddresses || []}
			count={10}
			changePage={(prev: boolean | undefined) => {}}
			loading={fetchingAddressList}
			order={order}
			orderBy={orderBy}
			setOrder={setOrder}
			setOrderBy={setOrderBy}
		/>
	);
}

export default AddressTableGraphql;
