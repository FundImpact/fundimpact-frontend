import { DocumentNode, ApolloCache } from "@apollo/client";

function updateCache<T, U = any>({
	query,
	variables,
	cb,
	store,
}: {
	query: DocumentNode;
	variables: U;
	cb: (dataRead: T | null) => T;
	store: ApolloCache<any>;
}): T | null | undefined {
	try {
		const dataRead = store.readQuery<T, U>({
			query,
			variables,
		});

		store.writeQuery<T, U>({
			query,
			variables,
			data: cb(dataRead),
		});

		return dataRead;
	} catch (err) {
		console.error(err);
	}
}

export default updateCache;
