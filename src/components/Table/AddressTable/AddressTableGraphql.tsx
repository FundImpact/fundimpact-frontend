import React, { useEffect, useState } from "react";
import AddressTableContainer from "./AddressTableContainer";
import { GET_ADDRESS_LIST, GET_ADDRESS_LIST_COUNT } from "../../../graphql/Address";
import pagination from "../../../hooks/pagination";

function AddressTableGraphql({ contactId }: { contactId: string }) {
	const [orderBy, setOrderBy] = useState<string>("created_at");
	const [order, setOrder] = useState<"asc" | "desc">("desc");
	const [queryFilter, setQueryFilter] = useState({});

	useEffect(() => {
		if (contactId) {
			setQueryFilter({
				t_4_d_contact: contactId,
			});
		}
	}, [setQueryFilter]);

	let { changePage, count, queryData: addressList, queryLoading, countQueryLoading } = pagination(
		{
			countQuery: GET_ADDRESS_LIST_COUNT,
			countFilter: queryFilter,
			query: GET_ADDRESS_LIST,
			queryFilter,
			sort: `${orderBy}:${order.toUpperCase()}`,
			retrieveContFromCountQueryResponse: "t4DAddressesConnection,aggregate,count",
		}
	);

	return (
		<AddressTableContainer
			addressList={addressList?.t4DAddresses || []}
			count={count}
			changePage={changePage}
			loading={queryLoading || countQueryLoading}
			order={order}
			orderBy={orderBy}
			setOrder={setOrder}
			setOrderBy={setOrderBy}
		/>
	);
}

export default AddressTableGraphql;
