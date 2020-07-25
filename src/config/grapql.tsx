import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, concat } from "@apollo/client";

const httpLink = new HttpLink({ uri: `${process.env.REACT_APP_BASEURL}/graphql` });

const authMiddleware = new ApolloLink((operation, forward) => {
	operation.setContext(({ headers = {} }: any) => ({
		headers: {
			...headers,
			authorization: localStorage.getItem("token") || null,
		},
	}));

	return forward(operation);
});
export const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: concat(authMiddleware, httpLink),
});
