import { GEOGRAPHIES_ACTIONS } from "../../components/Geographies/constants";
import { DIALOG_TYPE } from "../constants";

export interface IGeographiesState {
	id?: number;
	name: string;
	code: string;
	country: string;
	// country: {
	// 	id: string;
	// 	name: string;
	// };
}

export interface IGeographiesStateData extends Omit<IGeographiesState, "organization" | "id"> {
	id: string;
}

export type GoegraphiesStateProps = {
	open: boolean;
	handleClose: () => void;
	organization: number | string | undefined;
	dialogType?: DIALOG_TYPE;
} & (
	| {
			type: GEOGRAPHIES_ACTIONS.CREATE;
	  }
	| {
			type: GEOGRAPHIES_ACTIONS.UPDATE;
			data: IGeographiesState;
	  }
);
