import React from "react";
import { render } from "@testing-library/react";
// this adds custom jest matchers from jest-dom
import "../components/Forms/Project/__test__/node_modules/@testing-library/jest-dom/extend-expect";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

type RenderApolloOptions = {
	mocks?: MockedResponse[];
	addTypename?: any;
	defaultOptions?: any;
	cache?: any;
	resolvers?: any;
	[st: string]: any;
};
export const renderApollo = (
	node: any,
	{ mocks, addTypename, defaultOptions, cache, resolvers, ...options }: RenderApolloOptions = {}
) => {
	return render(
		<MockedProvider
			mocks={mocks}
			addTypename={addTypename}
			defaultOptions={defaultOptions}
			cache={cache}
			resolvers={resolvers}
		>
			{node}
		</MockedProvider>,
		options
	);
};
