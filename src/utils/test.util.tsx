import React from "react";
import { render } from "@testing-library/react";
// this adds custom jest matchers from jest-dom
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import messages from "../compiled-lang/en.json";
import { IntlProvider } from "react-intl";
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
		<IntlProvider messages={messages} locale={"en"} defaultLocale="en">
			<MockedProvider
				mocks={mocks}
				addTypename={addTypename}
				defaultOptions={defaultOptions}
				cache={cache}
				resolvers={resolvers}
			>
				{node}
			</MockedProvider>
		</IntlProvider>,
		options
	);
};
