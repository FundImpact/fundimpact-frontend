import { ThemeOptions } from "@material-ui/core";

export interface IUserDataContext {
	jwt?: string;
	user?: {
		id: string | number;
		theme?: ThemeOptions;
		role?: {
			id: string;
		};
	};
	logoutMsg?: string;
}
