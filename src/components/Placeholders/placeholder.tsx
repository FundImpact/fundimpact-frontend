/**
 * @description react-intl's FormatMessage cannot work on elemente's attribute values.
 * For that, we have to use their imperative APIs. But since these placeholders can
 * be re-used multiple places, we need to create a seperate file for better managing them.
 *
 * For this, the original idea is that we would keep all the fields as its associated
 * Message Descriptor in @file placeholder.json. Then we would dynamically import them
 * here and create the final object that would be consumed by react-intl's useIntl() hook.
 *
 * @deprecated
 * import * as placeholders from './placeholders.json';
 *	export let placeholderLabels: any;
 *  (function() {
 * 	    placeholderLabels = defineMessages({...placeholders})
 *   })();
 *
 * but at the time of implementing this functionality, react-intl support only inline Message
 * Descriptor. Therefore we cannot make use of @file placeholder.json.
 *
 *
 */
import { defineMessages } from "react-intl";

export const placeholders = defineMessages({
	email: {
		id: "emailPlaceholder",
		defaultMessage: "Email",
		description: "This label is to be used for text `Email`",
	},
	password: {
		id: "passwordPlaceholder",
		defaultMessage: "Password",
		description: "This label is to be used for text `Password`",
	},
});
