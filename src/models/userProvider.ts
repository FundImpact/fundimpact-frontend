import { ThemeOptions } from "@material-ui/core";

export interface IUserDataContext {
	jwt?: string;
	user?: {
		id: string | number;
		theme?: ThemeOptions;
		role?: {
			id: string;
		};
		language: string;
		organization: {
			id: string;
		};
	};
	logoutMsg?: string;
}
