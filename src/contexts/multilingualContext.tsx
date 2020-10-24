import React, { useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import defaultLanguage from "../../src/compiled-lang/en.json";
import { useAuth } from "./userContext";

async function loadLocaleData(locale: string) {
	if (!locale) return defaultLanguage;
	switch (locale) {
		case "hi":
			return import(`../../src/compiled-lang/hi.json`);
		default:
			return defaultLanguage;
	}

	/**
	 * @description The code below seems smaller than the one above for loading different
	 * the language's file, but we are still not using it because, in the apporach mention below,
	 * we cannot get types on the compiled lang.
	 */
	// try {
	// 	return import(`../src/compiled-lang/${locale}.json`);
	// } catch (error) {
	// 	console.error(
	// 		`Failed to fetch lang data for locale: ${locale}. Switching to default locale`
	// 	);
	// 	return defaultLocal;
	// }
}

const MultilingualProvider = ({ children }: { children: React.ReactNode | React.ReactElement }) => {
	const locale = navigator.languages[0] || navigator.language;
	const [messages, setMessages] = useState<any>(defaultLanguage);
	const { user } = useAuth();

	useEffect(() => {
		loadLocaleData(user?.language || locale).then((localeData) => {
			setMessages(localeData);
		});
	}, [user]);

	return (
		<IntlProvider messages={messages} locale={locale} defaultLocale="en">
			{children}
		</IntlProvider>
	);
};

export { MultilingualProvider };
